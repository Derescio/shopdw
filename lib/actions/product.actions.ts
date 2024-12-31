'use server';
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../app/db/prisma'
import { prismaToJSObject } from '../utils';


//Get latest product

export const getLatestProducts = async () => {
    const totalCount = await prisma.product.count(); // Total number of products
    const products = await prisma.product.findMany({

        orderBy: {
            createdAt: "desc",
        },
    });

    return {
        products: prismaToJSObject(products),
        totalCount,
    };
};

//Get product by slug
export const getProductBySlug = async (slug: string) => {
    // const prisma = new PrismaClient();
    const product = await prisma.product.findFirst({
        where: {
            slug
        }
    });
    return prismaToJSObject(product);
}