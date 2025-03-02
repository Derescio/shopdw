'use client';

import { Cart } from "@/types/index";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { Plus, Minus, Loader, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Button } from "@/components/ui/button";
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent } from "@/components/ui/card";
import { useSession } from "next-auth/react";


const CartTable = ({ cart }: { cart?: Cart }) => {
    const { data: session } = useSession();
    const router = useRouter();
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();
    const itemCount = cart?.items?.length ?? 0;
    const itemText = itemCount === 0 ? '0 items' : itemCount > 1 ? `${itemCount} items` : '1 item';

    const handleCheckout = () => {
        if (!session?.user) {
            toast({
                title: "Thanks for your business!",
                description: "Please sign in before continuing. After signing in, your items will be in your Cart. Thanks Again!",
                variant: "default",
                // duration: 5000,
            });
            setTimeout(() => {
                router.push("/sign-in");
            }, 5000);
            return;
        }
        startTransition(() => router.push("/shipping"));
    };



    return (<>
        <h1 className="py-4 h2-bold">Shopping Cart has {itemText} </h1>
        {!cart || cart.items.length === 0 ? (
            <div>
                <p className="text-center mb-4">Your cart is empty.!</p>
                <div className="flex-center">
                    <Button variant={'outline'} className="bg-gray-300">
                        <Link href="/"><span className="btn btn-primary">Go to Products</span></Link>
                    </Button>

                </div>
            </div>
        ) : (
            <div className="flex flex-col md:flex-row md:gap-5">
                <div className="overflow-x-auto md:flex-1" id="tableitems">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {cart.items.map((item) => (
                                <TableRow key={item.slug}>
                                    {/* Image and Name */}
                                    <TableCell>
                                        <Link href={`/product/${item.slug}`} className="flex items-center">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={50}
                                                height={50}
                                            />
                                            <span className="px-2">{item.name}</span>
                                        </Link>
                                    </TableCell>

                                    {/* Quantity */}
                                    <TableCell className="flex-center gap-2">
                                        <Button
                                            disabled={isPending}
                                            variant="outline"
                                            type="button"
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
                                            {isPending ? (
                                                <Loader className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Minus className="w-4 h-4" />
                                            )}
                                        </Button>
                                        <span>{item.qty}</span>
                                        <Button
                                            disabled={isPending}
                                            variant="outline"
                                            type="button"
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
                                            {isPending ? (
                                                <Loader className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Plus className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </TableCell>

                                    {/* Price */}
                                    <TableCell className="text-right">${item.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>

                <div id="subtotal" className="md:w-1/3">
                    <Card>
                        <CardContent className="p-4 gap-4 md:p-4 md:gap-4">
                            <div className="pb-3 text-xl sm:mx-auto text-center">
                                <div className="font-semibold text-2xl mb-2">Subtotal:</div>
                                <div className="text-3xl text-blue-500">{formatCurrency(cart.itemsPrice)}</div>
                                <div className="mt-2 text-sm text-gray-600">Free shipping on orders above $100!</div>
                                <div className="text-sm text-gray-600">Review your items before checking out!</div>
                            </div>
                            <Button onClick={handleCheckout} className="w-full" disabled={isPending}>
                                {isPending ? (
                                    <Loader className="animate-spin w-4 h-4" />
                                ) : (
                                    <ArrowRight className="w-4 h-4" />
                                )}
                                Proceed to Checkout
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )}
    </>);
}

export default CartTable;