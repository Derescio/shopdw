import NotFound from "@/app/not-found";
import { Button } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/order-actions";
import Link from "next/link";
import { redirect } from "next/navigation";
import Stripe from "stripe"


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string)

const SuccessPage = async (props: {
    params: Promise<{ id: string }>
    ; searchParams: Promise<{ payment_intent: string }>
}) => {

    const { id } = await props.params;
    const { payment_intent: paymentIntentId } = await props.searchParams;

    //Fetch the order by id
    const order = await getOrderById(id);
    if (!order) return <NotFound />;

    //Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    //Check if the payment intent is succeeded
    if (paymentIntent.metadata.orderId == null || paymentIntent.metadata.orderId !== order.id.toString()) {
        return <NotFound />
    }

    //Check if the payment intent is succeeded
    const isSuccess = paymentIntent.status === 'succeeded';

    if (!isSuccess) {
        return redirect(`/orders/${order.id}`)
    }



    return (
        <div className="max-w-4xl mx-auto w-full space-y-8">
            <div className="flex flex-col gap-6 items-center">
                <h1 className="bold">Thanks for your purchase</h1>
                <p>Your order has been successfully placed and is being processed.</p>
                <Button asChild>
                    <Link href={`/user/orders`} className="w-full">View Order</Link>

                </Button>
            </div>
        </div>
    )
}

export default SuccessPage;
