import { z } from 'zod';
import { formatNumber } from './utils';

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
    confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
})
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords don't match",
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
