'use client';
import { Review } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReviewForm from './review-form';
import { getReviews } from '@/lib/actions/review.actions';
import Rating from '@/components/shared/product/rating';



const ReviewList = ({ userId, productId, productSlug }: {
    userId: string;
    productId: string;
    productSlug: string;
}) => {

    const [review, setReviews] = useState<Review[]>([]);
    const reload = async () => {
        //console.log('review submitted');
    };


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
                    <Link
                        className='text-primary px-2'
                        href={`/sign-in?callbackUrl=/product/${productSlug}`}
                    >
                        <span className="font-semibold">sign in</span>
                    </Link>{' '}
                    to write a review
                </div>
            )}
            <div className="flex flex-col gap-3">
                {review.map((r) => (
                    <Rating key={r.id} value={r.rating} />
                ))}
            </div>
        </div>);
}

export default ReviewList;