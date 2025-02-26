'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { formatError, prismaToJSObject } from '../utils';
import { auth } from '@/auth';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.actions';
import { insertOrderSchema } from '../validators';
import { prisma } from '@/app/db/prisma';
import { CartItem, PaymentResult } from '@/types';
import { revalidatePath } from 'next/cache';
import { paypal } from '../paypal';
import { PAGE_SIZE } from '../constatnts';
import { Prisma } from '@prisma/client';




export const createOrder = async () => {

    const session = await auth();
    if (!session) throw new Error('User is not authenticated');
    const cart = await getMyCart();
    const userId = session?.user?.id;
    if (!userId) throw new Error('User not found');
    const user = await getUserById(userId);

    try {

        if (!cart || cart.items.length === 0) {
            return {
                success: false,
                message: 'Your cart is empty',
                //send the redirect to the client to redirect to the cart page
                redirectTo: '/cart',
            };
        }

        if (!user?.address) {
            return {
                success: false,
                message: 'No shipping address',
                //send the redirect to the client to redirect to the shipping page
                redirectTo: '/shipping',
            };
        }

        if (!user.paymentMethod) {
            return {
                success: false,
                message: 'No payment method',
                //send the redirect to the client to redirect to the payment-method page
                redirectTo: '/payment-method',
            };
        }


        // Create order object from the cart and user address and payment method
        const order = insertOrderSchema.parse({
            userId: user.id,
            shippingAddress: user.address,
            paymentMethod: user.paymentMethod,
            itemsPrice: cart.itemsPrice,
            shippingPrice: cart.shippingPrice,
            taxPrice: cart.taxPrice,
            totalPrice: cart.totalPrice,
        });


        // Create a transaction to create order and order items in database
        const insertedOrderId = await prisma.$transaction(async (tx) => {
            // Create order
            const insertedOrder = await tx.order.create({ data: order });
            // Create order items from the cart items
            for (const item of cart.items as CartItem[]) {
                await tx.orderItem.create({
                    data: {
                        ...item,
                        price: item.price,
                        orderId: insertedOrder.id,
                    },
                });
            }
            // Clear cart
            await tx.cart.update({
                where: { id: cart.id },
                data: {
                    items: [],
                    totalPrice: 0,
                    taxPrice: 0,
                    shippingPrice: 0,
                    itemsPrice: 0,
                },
            });

            return insertedOrder.id;

        });
        // After the Prisma Transaction is completed, 
        // check if its successful and return the order id. 
        // If not successful, throw an error


        if (!insertedOrderId) throw new Error('Order not created');
        return {
            success: true,
            message: 'Order created',
            //send the redirect to the client to redirect to the order/insertedOrderId} page
            redirectTo: `/order/${insertedOrderId}`,
        };

    } catch (error) {
        if (isRedirectError(error)) throw error;
        return { success: false, message: formatError(error) };
    }
};



export async function getOrderById(orderId: string) {
    const data = await prisma.order.findFirst({
        where: {
            id: orderId,
        },
        include: {
            orderitems: true,
            user: { select: { name: true, email: true } },
        },
    });
    return prismaToJSObject(data);
}

//Create New Papal Payment/Order

export async function createPayPalOrder(orderId: string) {
    try {
        // Get order from database
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
            },
        });
        if (order) {
            // Create a paypal order
            const paypalOrder = await paypal.createOrder(Number(order.totalPrice));

            // Update the order with the paypal order id
            await prisma.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    paymentResult: {
                        id: paypalOrder.id,
                        email_address: '',
                        status: '',
                        pricePaid: '0',
                    },
                },
            });

            // Return the paypal order id
            return {
                success: true,
                message: 'PayPal order created successfully',
                data: paypalOrder.id,
            };
        } else {
            throw new Error('Order not found');
        }
    } catch (err) {
        return { success: false, message: formatError(err) };
    }
}

export async function approvePayPalOrder(
    orderId: string,
    data: { orderID: string }
) {
    try {
        // Find the order in the database
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
            },
        })
        if (!order) throw new Error('Order not found')

        // Check if the order is already paid
        const captureData = await paypal.capturePayment(data.orderID)
        if (
            !captureData ||
            captureData.id !== (order.paymentResult as PaymentResult)?.id ||
            captureData.status !== 'COMPLETED'
        )
            throw new Error('Error in paypal payment')

        await updateOrderToPaid({
            orderId,
            paymentResult: {
                id: captureData.id,
                status: captureData.status,
                email_address: captureData.payer.email_address,
                pricePaid:
                    captureData.purchase_units[0]?.payments?.captures[0]?.amount?.value,
            },
        });
        revalidatePath(`/order/${orderId}`)

        return {
            success: true,
            message: 'Your order has been successfully paid by PayPal',
            redirectTo: '/',
        }
    } catch (err) {
        return { success: false, message: formatError(err) }
    }
}


export async function updateOrderToPaid({
    orderId,
    paymentResult,
}: {
    orderId: string;
    paymentResult?: PaymentResult;
}) {
    // Find the order in the database and include the order items
    const order = await prisma.order.findFirst({
        where: {
            id: orderId,
        },
        include: {
            orderitems: true,
        },
    });

    if (!order) throw new Error('Order not found');

    if (order.isPaid) throw new Error('Order is already paid');

    // Transaction to update the order and update the product quantities
    await prisma.$transaction(async (tx) => {
        // Update all item quantities in the database
        for (const item of order.orderitems) {
            await tx.product.update({
                where: { id: item.productId },
                data: { stock: { increment: -item.qty } },
            });
        }

        // Set the order to paid
        await tx.order.update({
            where: { id: orderId },
            data: {
                isPaid: true,
                paidAt: new Date(),
                paymentResult,
            },
        });
    });

    // Get the updated order after the transaction
    const updatedOrder = await prisma.order.findFirst({
        where: {
            id: orderId,
        },
        include: {
            orderitems: true,
            user: { select: { name: true, email: true } },
        },
    });

    if (!updatedOrder) {
        throw new Error('Order not found');
    }
};


export async function updateOrderToPaidByCOD(orderId: string) {
    try {
        await updateOrderToPaid({ orderId });
        revalidatePath(`/order/${orderId}`);
        return { success: true, message: 'Order paid successfully' };
    } catch (err) {
        return { success: false, message: formatError(err) };
    }
}

// Update COD Order To Delivered
export async function deliverOrder(orderId: string) {
    try {
        const order = await prisma.order.findFirst({
            where: {
                id: orderId,
            },
        });

        if (!order) throw new Error('Order not found');
        if (!order.isPaid) throw new Error('Order is not paid');

        await prisma.order.update({
            where: { id: orderId },
            data: {
                isDelivered: true,
                deliveredAt: new Date(),
            },
        });

        revalidatePath(`/order/${orderId}`);

        return { success: true, message: 'Order delivered successfully' };
    } catch (err) {
        return { success: false, message: formatError(err) };
    }
}


//Fetch Orders
export async function getOrder({ limit = PAGE_SIZE, page }: { limit?: number, page: number }) {
    const session = await auth();
    if (!session) {
        throw new Error('You must be logged in to view your orders');
    }


    const data = await prisma.order.findMany({
        where: {
            userId: session?.user?.id,
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: limit,
        skip: (page - 1) * limit,
        // include: {
        //     orderitems: true,
        //     user: { select: { name: true, email: true } },
        // },
    });

    const dataCount = await prisma.order.count({
        where: {
            userId: session?.user?.id,
        },
    });
    return {
        data,
        totalPages: Math.ceil(dataCount / limit),
    };
}


type SalesDataType = {
    month: string;
    totalSales: number;
}[]

// Get Sales Data and Order Summary
export async function getOrderSummary() {
    //Get Count for each resource(Product, Category, User, Order)
    const orderCount = await prisma.order.count();
    const productCount = await prisma.product.count();
    const userCount = await prisma.user.count();

    //Calculate Total Sales
    const totalSales = await prisma.order.aggregate({
        _sum: {
            totalPrice: true,
        },
    });


    // Calculate Toatl CostPrce
    const totalProfit = async () => {
        // Aggregate all sales data
        const sales = await prisma.orderItem.aggregate({
            _sum: {
                price: true, // Total sales revenue
                qty: true,   // Total quantity sold
            },
        });

        // Join products to calculate the total cost
        const costData = await prisma.orderItem.findMany({
            include: {
                product: {
                    select: {
                        costPrice: true, // Product costPrice
                    },
                },
            },
        });
        //console.log(sales);


        // Calculate the total cost
        const totalCost = costData.reduce((sum, item) => {
            return sum + item.qty * item.product.costPrice.toNumber();
        }, 0);

        // Calculate profit
        const totalRevenue = sales._sum.price?.toString() || 0;
        const profit = Number(totalRevenue) - totalCost;

        return {
            totalRevenue,
            totalCost,
            profit,
        };
    };

    // Example usage
    const result = await totalProfit();
    //console.log("Total Profit:", result);



    const profitBySKU = async () => {
        // Get aggregated data grouped by productId (SKU)
        const salesData = await prisma.orderItem.groupBy({
            by: ['productId'],
            _sum: {
                qty: true,
                price: true,
            },
        });

        // Fetch cost prices for the SKUs
        const productData = await prisma.product.findMany({
            select: {
                id: true,
                costPrice: true,
            },
        });

        // Map product costs
        const costMap = productData.reduce((map, product) => {
            map[product.id] = product.costPrice.toNumber();
            return map;
        }, {} as Record<string, number>);

        // Calculate profit for each SKU
        const profitDetails = salesData.map((item) => {
            const totalCost = (item._sum.qty || 0) * (costMap[item.productId] || 0);
            const totalRevenue = item._sum.price?.toString() || 0;
            return {
                productId: item.productId,
                totalRevenue,
                totalCost,
                profit: Number(totalRevenue) - totalCost,
            };
        });

        return profitDetails;
    };

    // Example usage
    const skuProfits = await profitBySKU();
    // console.log("Profit by SKU:", skuProfits);


    //Get Sales Data(Revenue)
    const salesDataRaw = await prisma.$queryRaw<
        Array<{ month: string; totalSales: Prisma.Decimal }>
    >`SELECT to_char("createdAt", 'MM/YY') as "month", sum("totalPrice") as "totalSales" FROM "Order" GROUP BY to_char("createdAt", 'MM/YY')`;

    const salesData: SalesDataType = salesDataRaw.map((entry) => ({
        month: entry.month,
        totalSales: Number(entry.totalSales), // Convert Decimal to number
    }));
    //Get Lastest Sales
    const latestOrders = await prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            user: { select: { name: true } },
        },
        take: 6,
    });

    return {
        orderCount,
        productCount,
        userCount,
        totalSales,
        latestOrders,
        salesData,
        skuProfits,
        result,
    };
}

// Get All Orders (Admin)
export async function getAllOrders({
    limit = PAGE_SIZE,
    page,
    query
}: {
    limit?: number;
    page: number;
    query?: string;
}) {
    const queryFilter: Prisma.OrderWhereInput = query && query !== 'all' ? { user: { name: { contains: query, mode: 'insensitive' } as Prisma.StringFilter } } : {}

    const data = await prisma.order.findMany({
        where: { ...queryFilter },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: (page - 1) * limit,
        include: { user: { select: { name: true } } },
    });

    const dataCount = await prisma.order.count();

    return {
        data,
        totalPages: Math.ceil(dataCount / limit),
    };
}


export async function deleteOrder(id: string) {
    try {
        await prisma.order.delete({ where: { id } });

        revalidatePath('/admin/orders');

        return {
            success: true,
            message: 'Order deleted successfully',
        };
    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}