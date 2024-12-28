'use server';
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../app/db/prisma'
import { prismaToJSObject } from '../utils';
import { LATEST_PRODUCTS_LIMIT } from '../constatnts';

//Get latest product
export const getLatestProducts = async () => {
    // const prisma = new PrismaClient();
    const products = await prisma.product.findMany({
        take: LATEST_PRODUCTS_LIMIT,
        orderBy: {
            createdAt: 'desc'
        }
    });
    return prismaToJSObject(products);
}

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