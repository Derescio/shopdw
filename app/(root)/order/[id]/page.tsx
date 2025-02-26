import { Metadata } from "next";
import NotFound from "@/app/not-found";
import { getOrderById } from "@/lib/actions/order-actions";
import OrderDetailsTable from './order-details-table';
import { ShippingAddress } from "@/types";
import { auth } from "@/auth";
import Stripe from 'stripe';

export const metadata: Metadata = {
    title: 'Order Details',
    description: 'Order Details',
}

const OrderDetailsPage = async (props: { params: Promise<{ id: string }> }) => {
    const { id } = await props.params;
    const order = await getOrderById(id);
    if (!order) return <NotFound />;

    const session = await auth()
    if (!session) return <NotFound />;
    let client_secret = null;
    //Check if the order is not and is using stripe
    if (order.paymentMethod === 'Credit Card' && !order.isPaid) {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(Number(order.totalPrice) * 100),
            currency: 'usd',
            //payment_method_types: ['card'],
            metadata: {
                orderId: order.id,
            },
        });
        client_secret = paymentIntent.client_secret as string;

    }
    // console.log(client_secret)
    return (
        <>
            <OrderDetailsTable
                order={{
                    ...order,
                    shippingAddress: order.shippingAddress as ShippingAddress,
                }}
                stripeClientSecret={client_secret}
                paypalClientId={process.env.PAYPAL_CLIENT_ID || 'sb'}
                isAdmin={session?.user?.role === 'admin' || false}
            />
        </>
    )
}

export default OrderDetailsPage;