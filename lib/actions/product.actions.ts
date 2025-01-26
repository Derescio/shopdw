'use server';
import { revalidatePath } from 'next/cache';
// import { PrismaClient } from '@prisma/client';
import { prisma } from '../../app/db/prisma'
import { PAGE_SIZE } from '../constatnts';
import { formatError, prismaToJSObject } from '../utils';
import { insertProductSchema, updateProductSchema } from '../validators';
import { z } from 'zod';


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

export async function getProductById(productId: string) {
    const data = await prisma.product.findFirst({
        where: { id: productId },
    });

    return prismaToJSObject(data);
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

// Get all Products
// export async function getAllProducts({
//     query,
//     limit = PAGE_SIZE,
//     page,
//     category,
// }: {
//     query: string;
//     limit?: number;
//     page: number;
//     category?: string;
// }) {
//     const whereClause: any = {};

//     if (query) {
//         whereClause.OR = [
//             { name: { contains: query, mode: 'insensitive' } },
//             { description: { contains: query, mode: 'insensitive' } },
//         ];
//     }

//     if (category) {
//         whereClause.category = category;
//     }

//     const data = await prisma.product.findMany({
//         where: whereClause,
//         skip: (page - 1) * limit,
//         take: limit,
//     });

//     const dataCount = await prisma.product.count({
//         where: whereClause,
//     });

//     return {
//         data,
//         totalPages: Math.ceil(dataCount / limit),
//     };
// }

export async function getAllProducts({
    query,
    limit = PAGE_SIZE,
    page,
    category,
}: {
    query: string;
    limit?: number;
    page: number;
    category?: string;
}) {
    const data = await prisma.product.findMany({
        where: {
            name: {
                contains: query, // Filter by query (e.g., product name)
                mode: 'insensitive', // Optional: Case-insensitive search
            },
            category: category ? category : undefined, // Filter by category if provided
        },
        skip: (page - 1) * limit,
        take: limit,
    });

    const dataCount = await prisma.product.count({
        where: {
            name: {
                contains: query,
                mode: 'insensitive',
            },
            category: category ? category : undefined,
        },
    });

    return {
        data,
        totalPages: Math.ceil(dataCount / limit),
    };
}


//Create a Product
export async function createProduct(data: z.infer<typeof insertProductSchema>) {

    try {
        const product = insertProductSchema.parse(data);
        await prisma.product.create({
            data: product
        });
        revalidatePath('/admin/products');
        return { success: true, message: 'Product created successfully' };

    } catch (error) {
        return { success: false, message: formatError(error) };
    }
}

//Update a Product
export async function updateProduct(data: z.infer<typeof updateProductSchema>) {

    try {
        const product = updateProductSchema.parse(data);
        const productExists = await prisma.product.findFirst({ where: { id: product.id } });
        if (!productExists) {
            throw new Error('Product not found');
        } else {
            await prisma.product.update({
                where: { id: product.id },
                data: product
            })
        }
        revalidatePath('/admin/products');
        return { success: true, message: 'Product updated successfully' };
    } catch (error) {
        return { success: false, message: formatError(error) };
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

//Get All categories
export async function getAllCategories() {
    const categories = await prisma.product.groupBy({
        by: ['category'],
        _count: true
    });
    return categories;
}

// Get products by category
export async function getFeaturedProducts() {
    const products = await prisma.product.findMany({
        where: {
            isFeatured: true,

        },
        orderBy: { createdAt: 'desc' },
        take: 4
    });
    //Convert prisma object to JS object
    return prismaToJSObject(products);
}