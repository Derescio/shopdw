import { getProductBySlug } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { getMyCart } from '@/lib/actions/cart.actions';
import { Card, CardContent } from "@/components/ui/card";
import ProductPrice from "@/components/shared/product/product-price";
import ProductImages from "@/components/shared/product/product-images";
import AddToCart from "@/components/shared/cart/add-to-cart";
import { Metadata } from "next";
// import ShareButtons from "@/components/shared/sharebuttons/share-buttons";
import ReviewList from "./review-list";
import { auth } from "@/auth";
import Rating from "@/components/shared/product/rating";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = {
    title: 'Products Page',
    description: 'Products Page',
};

const ProductPage = async (props: { params: Promise<{ slug: string }> }) => {
    const params = await props.params;
    const { slug } = params;
    const cart = await getMyCart();
    const session = await auth();
    const userId = session?.user?.id;

    const product = await getProductBySlug(slug);

    if (!product) {
        notFound();
    }
    const discountedPrice = Number(
        (!product.isDiscounted
            ? Number(product.price) * (1 - (product.discountRate ?? 0) / 100)
            : Number(product.price)
        ).toFixed(2)
    );


    return (
        <>
            <section>
                <div className="grid grid-cols-1 md:grid-cols-5">
                    {/* Images Column */}
                    <div className="col-span-2">
                        <ProductImages images={product.images} />
                    </div>
                    {/* Details Column */}
                    <div className="col-span-2 p-5">
                        <div className="flex flex-col gap-6">
                            <p>
                                {product.brand}{' - '} {product.category}
                            </p>
                            <h1 className="h3-bold">{product.name}</h1>
                            <div className="flex items-center gap-2 text-xl">
                                <Rating value={Number(product.rating)} />
                                - {product.numReviews} Reviews
                            </div>
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                <ProductPrice
                                    value={discountedPrice}
                                    className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
                                />
                                {(product.discountRate ?? 0) > 0 ? (
                                    <span className="text-md line-through text-gray-500 ">
                                        {formatCurrency(Number(product.price))}
                                    </span>
                                ) : ''
                                }
                            </div>

                        </div>
                        <div className="mt-10 mb-10">
                            <p className="font-semibold">Description</p>
                            <p>{product.description}.</p>
                        </div>
                    </div>
                    {/* Actions Column */}
                    <div>
                        <Card>
                            <CardContent className="p-4">
                                <div className="mb-2 flex justify-between">
                                    <div>Price</div>
                                    <div>
                                        <ProductPrice value={discountedPrice} />

                                        {product.isDiscounted && (
                                            <span className="text-sm line-through text-gray-500">
                                                {formatCurrency(Number(product.price))}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className='mb-2 flex justify-between'>
                                    <div>Status</div>
                                    {product.stock > 0 ? (
                                        <Badge variant='outline'>In stock</Badge>
                                    ) : (
                                        <Badge variant='destructive'>Unavailable</Badge>
                                    )}
                                </div>
                                {product.stock > 0 && (
                                    <div className=' flex-center'>
                                        <AddToCart
                                            cart={cart}
                                            item={{
                                                productId: product.id,
                                                name: product.name,
                                                slug: product.slug,
                                                price: discountedPrice,
                                                qty: 1,
                                                image: product.images![0],
                                                isDiscounted: product.isDiscounted,
                                                discountRate: product.discountRate || 0,
                                            }}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                        <Link href="/" className="mt-4">
                            <Button className="w-full mt-4 bg-green-100 text-black px-5 py-2" variant='outline'>
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section>
                <h2 className="h2-bold mt-6">Customer Reviews</h2>
                <ReviewList userId={userId || ""} productId={product.id} productSlug={product.slug} />
            </section>
        </>
    );
}

export default ProductPage;