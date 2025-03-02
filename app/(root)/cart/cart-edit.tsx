'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';


import { Cart } from "@/types/index";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { useToast } from '@/hooks/use-toast';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { Loader, Minus, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';


const CartEdit = ({ cart }: { cart: Cart }) => {

    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();


    return (
        <div className="flex flex-col gap-4">
            {cart?.items.map((item) => (
                <Card key={item.slug} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href={`/product/${item.slug}`} className="flex items-center gap-2">
                            <Image src={item.image} alt={item.name} width={50} height={50} />
                            <span className="font-semibold">{item.name}</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            disabled={isPending}
                            variant="outline"
                            onClick={() =>
                                startTransition(async () => {
                                    const res = await removeItemFromCart(item.productId);
                                    if (!res.success) {
                                        toast({
                                            variant: "destructive",
                                            description: res.message,
                                            duration: 2500,
                                        });
                                    }
                                })
                            }
                        >
                            {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Minus className="w-4 h-4" />}
                        </Button>
                        <span className="text-lg font-medium">{item.qty}</span>
                        <Button
                            disabled={isPending}
                            variant="outline"
                            onClick={() =>
                                startTransition(async () => {
                                    const res = await addItemToCart(item);
                                    if (!res.success) {
                                        toast({
                                            variant: "destructive",
                                            description: res.message,
                                            duration: 2500,
                                        });
                                    }
                                })
                            }
                        >
                            {isPending ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        </Button>
                    </div>
                    <span className="text-lg font-semibold">{formatCurrency(item.price)}</span>
                </Card>
            ))}
        </div>
    );
};

export default CartEdit;
