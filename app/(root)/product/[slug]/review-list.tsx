'use client';
import { Review } from "@/types/index";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReviewForm from './review-form';
import { getReviews } from '@/lib/actions/review.actions';
import Rating from '@/components/shared/product/rating';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarCheck, User } from "lucide-react";
import { formatDateTime } from "@/lib/utils";



const ReviewList = ({ userId, productId, productSlug }: {
    userId: string;
    productId: string;
    productSlug: string;
}) => {

    const [review, setReviews] = useState<Review[]>([]);
    const reload = async () => {
        //Reload Reviews
        const res = await getReviews({ productId });
        setReviews([...res.data]);
    };
    //console.log(review);

    useEffect(() => {
        /// Load reviews from the database
        const loadReviews = async () => {
            const res = await getReviews({ productId });
            setReviews(res.data);
        };

        loadReviews();
    }, [productId]);

    return (
        <div className="space-y-4 ">
            {review.length === 0 && <div>No reviews</div>}
            {/* Only Show  */}

            {/* If session exists, show review form(Button) */}
            {userId ? (
                <>
                    <ReviewForm userId={userId} productId={productId} onReviewSubmitted={reload} />
                </>
            ) : (
                <div>
                    Please{' '}
                    <Link className='text-primary px-2'
                        href={`/sign-in?callbackUrl=/product/${productSlug}`}
                    >
                        <span className="font-semibold">sign in</span>
                    </Link>{' '}
                    to write a review
                </div>
            )}
            <div className="flex flex-col gap-3">

                {review.map((r) => (
                    <Card key={r.id} className="border p-4">
                        <CardHeader>
                            <div className="flex flex-col gap-y-2">
                                {r.title && <CardTitle className="text-lg">{r.title}</CardTitle>}
                                <CardDescription className="text-gray-600">{r.description}</CardDescription>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <div className="flex flex-col gap-y-4 text-sm text-muted-foreground">
                                {/* Star Rating */}
                                <div className="flex items-center">
                                    <Rating value={r.rating} />
                                </div>

                                {/* Date and User Info */}
                                <div className="flex justify-start items-center text-gray-500 space-x-4 ">
                                    <div className="flex items-center gap-x-2">
                                        <CalendarCheck className="h-4 w-4" />
                                        {formatDateTime(r.createdAt).dateTime}
                                    </div>
                                    <div className="flex items-center gap-x-2">
                                        <User className="h-4 w-4" />
                                        <span>{r.user ? r.user.name : 'Anonymous'}</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}


            </div>
        </div>);
}

export default ReviewList;