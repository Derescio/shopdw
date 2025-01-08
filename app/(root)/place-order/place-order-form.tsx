'use client';

import { createOrder } from "@/lib/actions/order-actions";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Loader, Check } from "lucide-react";

const PlaceOrderForm = () => {
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const res = await createOrder();
        if (res.redirectTo) {
            router.push(res.redirectTo);
        }
    }

    const PlaceOrderButton = () => {
        const { pending } = useFormStatus();
        return (<Button disabled={pending} className="w-full">
            {pending ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
            Place Order
        </Button>
        )
    }
    return (<>
        <form onSubmit={handleSubmit} className="w-full">
            <PlaceOrderButton />
        </form>
    </>);
}

export default PlaceOrderForm;