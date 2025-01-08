'use server';

import { isRedirectError } from 'next/dist/client/components/redirect-error';
import { formatError, prismaToJSObject } from '../utils';
import { auth } from '@/auth';
import { getMyCart } from './cart.actions';
import { getUserById } from './user.actions';
import { insertOrderSchema } from '../validators';
import { prisma } from '@/app/db/prisma';
import { CartItem } from '@/types';



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

