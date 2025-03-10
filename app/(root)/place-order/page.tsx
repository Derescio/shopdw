import { Metadata } from "next";
import { getMyCart } from "@/lib/actions/cart.actions";
import PlaceOrderForm from "./place-order-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserById } from "@/lib/actions/user.actions";
import { ShippingAddress } from "@/types/index";
import { formatCurrency } from '@/lib/utils';
import CheckOutSteps from "@/components/shared/checkout-steps";

import { Card, CardContent } from '@/components/ui/card';
import {
    Table,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import ShippingMethodEdit from "../shipping/shippingmethodedit";
import PaymentMethodEdit from "../payment-method/payment-method-edit";
import CartEdit from "../cart/cart-edit";

export const metadata: Metadata = {
    title: 'Place Order',
    description: 'Place Order',
}


const PlaceOrderPage = async () => {
    const session = await auth();
    const userId = session?.user?.id;
    const cart = await getMyCart();

    if (!userId) redirect('/');
    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) redirect('/cart');
    if (!user?.address) redirect('/shipping');
    if (!user.paymentMethod) redirect('/payment-method');

    const userAddress = user.address as ShippingAddress;
    // console.log(userAdrress)

    return (<>
        <CheckOutSteps current={3} />
        <h1 className='py-4 text-2xl'>Place Order</h1>

        <div className='grid md:grid-cols-3 md:gap-5'>
            <div className='overflow-x-auto md:col-span-2 space-y-4'>
                <Card>
                    <CardContent className='p-4 gap-4'>
                        <h2 className='text-xl pb-4'>Shipping Address</h2>
                        <p>{userAddress.fullName}</p>
                        <p>
                            {userAddress.streetAddress}, {userAddress.city}, {userAddress.postalCode},{' '}
                            {userAddress.country}{' '}
                        </p>
                        <div className='mt-3'>
                            <ShippingMethodEdit address={userAddress} />
                        </div>
                    </CardContent>
                </Card>


                <Card>
                    <CardContent className='p-4 gap-4'>
                        <h2 className='text-xl pb-4'>Payment Method</h2>
                        <p>{user.paymentMethod}</p>
                        <div className='mt-3'>
                            <PaymentMethodEdit paymentmethod={{ type: user.paymentMethod }} />
                        </div>
                    </CardContent>
                </Card>


                <Card>
                    <CardContent className='p-4 gap-4'>
                        <h2 className='text-xl pb-4'>Order Items</h2>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Item</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                </TableRow>
                            </TableHeader>
                            {/* <TableBody>
                                {cart.items.map((item) => (
                                    <TableRow key={item.slug}>
                                        <TableCell>
                                            <Link
                                                href={`/product/${item.slug}`}
                                                className='flex items-center'
                                            >
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={50}
                                                    height={50}
                                                ></Image>
                                                <span className='px-2'>{item.name}</span>
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <span className='px-2'>{item.qty}</span>
                                        </TableCell>
                                        <TableCell className='text-right'>${item.price}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody> */}
                        </Table>
                        <CartEdit cart={cart} />
                    </CardContent>
                </Card>
            </div>
            <div>
                <Card className="mt-4 md:mt-0">
                    <CardContent className='p-4 gap-4 space-y-4'>
                        <div className='flex justify-between'>
                            <div>Subtotal</div>
                            <div>{formatCurrency(cart.itemsPrice)}</div>
                        </div>
                        <div className='flex justify-between'>
                            <div>Tax</div>
                            <div>{formatCurrency(cart.taxPrice)}</div>
                        </div>
                        <div className='flex justify-between'>
                            <div>Shipping</div>
                            <div>{formatCurrency(cart.shippingPrice)}</div>
                        </div>
                        <div className='flex justify-between'>
                            <div>Total</div>
                            <div>{formatCurrency(cart.totalPrice)}</div>
                        </div>
                        <PlaceOrderForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    </>);
}

export default PlaceOrderPage 