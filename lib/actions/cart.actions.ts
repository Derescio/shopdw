'use server';

import { CartItem } from '@/types';
import { cookies } from 'next/headers';

import { formatError } from '../utils';
//eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function addItemToCart(data: CartItem) {

    try {
        //Get the cart id from the session cookie
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;

        console.log({
            sessionCartId,

        })

        return {
            success: true,
            message: 'Item added to the cart',
        };
    } catch (error) {
        return {
            success: false,
            message: formatError(error),
        };
    }


};