'use client';

import { ShoppingCart, Loader } from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { deleteCart } from "@/lib/actions/cart.actions";
import { useTransition } from "react";

const DeleteCart = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const handleDeleteCart = () => {
        startTransition(async () => {
            const res = await deleteCart();
            if (res.success) {
                router.push('/');
            } else {
                alert(res.message);
            }
        });
    };

    return (
        <div className="mt-10 flex justify-center">
            <Button
                variant='outline'
                className="bg-red-700 text-white mt-10"
                onClick={handleDeleteCart}
                disabled={isPending}
            >
                {isPending ? (
                    <Loader className="animate-spin w-4 h-4" />
                ) : (
                    <>
                        <ShoppingCart size={24} /> Delete Cart
                    </>
                )}
            </Button>
        </div>
    );
};

export default DeleteCart;