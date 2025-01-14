'use server';
import { revalidatePath } from 'next/cache';
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../app/db/prisma'
import { PAGE_SIZE } from '../constatnts';
import { formatError, prismaToJSObject } from '../utils';


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

// Get all Products
export const getAllProducts = async ({
    //disable eslint rules
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    query,
    limit = PAGE_SIZE,
    page,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    category
}: {
    query: string,
    limit?: number,
    page: number,
    category?: string
}) => {

    const offset = (page - 1) * limit;
    const data = await prisma.product.findMany({
        skip: offset,
        take: limit,
    })

    const dataCount = await prisma.product.count();
    //console.log(dataCount)

    return {
        data,
        totalPages: Math.ceil(dataCount / limit),
    }


}

export async function deleteProduct(id: string) {
    try {
        const productExists = await prisma.product.findFirst({ where: { id } });
        if (!productExists) {
            throw new Error('Product not found');
        } else {
            await prisma.product.delete({ where: { id } });
            revalidatePath('/admin/products');
            return {
                success: true,
                message: 'Product deleted successfully',
            };
        }


    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}