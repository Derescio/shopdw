import { z } from 'zod';
import { formatNumber } from './utils';
import { PAYMENT_METHODS } from '@/lib/constatnts'

//Schema for inserting products
const currency = z.string().refine((value) => /^\d+(\.\d{2})?$/.test(formatNumber(Number(value))),
    'Price must be a number and have 2 decimal places')

export const insertProductSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters').max(255),
    slug: z.string().min(3, 'Slug must be at least 3 characters').max(255),
    category: z.string().min(3).max(255),
    brand: z.string().min(3).max(255),
    description: z.string().min(3).max(255),
    stock: z.coerce.number().min(0),
    images: z.array(z.string()).min(1, 'At least one image is required'),
    isFeatured: z.boolean(),
    banner: z.string().nullable(),
    price: currency
});

//Schema for signing up users
export const signInFormSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});


// SignUp/Register Schema
export const signUpFormSchema = z.object({
    name: z.string().min(6, 'Name must be at least 6 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm password Error'),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match.",
        path: ['confirmPassword'],

    })

//The refine function is used to add custom validation to the schema. 
// In this case, we are checking if the password and confirmPassword fields match.
//It takes a function that returns a boolean value. 
// If the function returns false, the validation will fail.
// The path option is used to specify the field that failed the validation.
// In this case, the path is confirmPassword.
// If the validation fails, the error message will be displayed.
// The error message is displayed in the form of an object with a message property.
// If the password and confirmPassword fields match, the validation will pass and the program will continue.



//Schema for Cart
export const cartItemSchema = z.object({
    productId: z.string().min(1, 'Product is required'),
    name: z.string().min(1, 'Name is required'),
    slug: z.string().min(1, 'Slug is required'),
    qty: z.number().int().nonnegative('Quantity must be a positive number'),
    image: z.string().min(1, 'Image is required'),
    price: z
        .number()
        .refine((value) => /^\d+(\.\d{2})?$/.test(formatNumber(Number(value))),
            'Price must be a number and have 2 decimal places')

});


export const insertCartSchema = z.object({
    items: z.array(cartItemSchema),
    itemsPrice: currency,
    totalPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    sessionCartId: z.string().min(1, 'Session cart id is required'),
    userId: z.string().optional().nullable(),
});



export const shippingAddressSchema = z.object({
    fullName: z.string().min(3, 'Name must be at least 3 characters'),
    streetAddress: z.string().min(3, 'Address must be at least 3 characters'),
    city: z.string().min(3, 'city must be at least 3 characters'),
    postalCode: z.string().min(3, 'Postal code must be at least 3 characters'),
    country: z.string().min(3, 'Country must be at least 3 characters'),
    lat: z.number().optional(),
    lng: z.number().optional(),
});

//Schema for payment methods
//Payment Schema
export const paymentMethodSchema = z
    .object({
        type: z.string().min(1, 'Payment method is required'),
    })
    .refine((data) => PAYMENT_METHODS.includes(data.type), {
        path: ['type'],
        message: 'Select payment method',
    });

export const insertOrderSchema = z.object({
    userId: z.string().min(1, 'User is required'),
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    totalPrice: currency,
    paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
        message: 'Invalid payment method',
    }),
    shippingAddress: shippingAddressSchema,
});

export const insertOrderItemSchema = z.object({
    productId: z.string(),
    slug: z.string(),
    image: z.string(),
    name: z.string(),
    price: currency,
    qty: z.number(),
});