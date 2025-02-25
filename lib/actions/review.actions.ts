'use server';

import { insertReviewSchema } from "../validators";
import { z } from 'zod';
import { formatError } from "../utils";
import { auth } from "@/auth";
import { prisma } from "@/app/db/prisma";
import { revalidatePath } from "next/cache";


//Create and Update Review
export async function createUpdateReview(data: z.infer<typeof insertReviewSchema>) {

    try {
        //Check for user session
        const session = await auth();
        if (!session) {
            return {
                success: false,
                message: 'Unauthorized. Please sign in to continue'
            }
        }
        //Validate and Store the Review in a variable
        const review = insertReviewSchema.parse({ ...data, userId: session?.user?.id });
        //Check  for the product to be reviewed
        const product = await prisma.product.findFirst({
            where: { id: review.productId }
        });
        //if product is found, send a message
        if (!product) {
            return {
                success: false,
                message: 'Product not found'
            }
        }
        //Check if the user has already reviewed the product
        const existingReview = await prisma.review.findFirst({
            where: {
                userId: review.userId,
                productId: review.productId
            }
        });
        //if the user has already reviewed the product, update the review else create a new review

        await prisma.$transaction(async (tx) => {
            if (existingReview) {
                await tx.review.update({
                    where: { id: existingReview.id },
                    data: {
                        title: review.title,
                        description: review.description,
                        rating: review.rating
                    }
                })
            } else {
                await tx.review.create({
                    data: {
                        title: review.title,
                        description: review.description,
                        rating: review.rating,
                        productId: review.productId,
                        userId: review.userId
                    }
                });
            }
            //Get the average rating for the product
            const averageRating = await tx.review.aggregate({
                _avg: {
                    rating: true
                },
                where: {
                    productId: review.productId
                }
            })
            // Get the number of reviews for the product
            const numReviews = await tx.review.count({
                where: {
                    productId: review.productId
                }
            })
            //Update the product with the new average rating and number of reviews
            await tx.product.update({
                where: { id: review.productId },
                data: {
                    rating: averageRating._avg.rating || 0,
                    numReviews: numReviews
                }
            })
        })
        revalidatePath(`/product/${product.slug}`);
        return {
            success: true,
            message: 'Review submitted successfully. Thank You!'
        }

    } catch (error) {
        return {
            success: false,
            message: formatError(error)
        }
    }

}


//Get Reviews
export async function getReviews({ productId }: { productId: string }) {
    const data = await prisma.review.findMany({
        where: {
            productId: productId,
        },
        include: {
            user: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return { data };
}

//Get Review By Product Id
export const getReviewByProductId = async ({ productId, }: { productId: string }) => {
    const session = await auth();
    if (!session) throw new Error('User is not authenticated');

    return await prisma.review.findFirst({
        where: { productId, userId: session?.user.id },
    });
};