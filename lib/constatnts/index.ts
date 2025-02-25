export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'ShopDW';
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESCRIPTION || 'Selling wide ranges of products';
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';
export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;
export const signInDefaultValues = { email: '', password: '' };
export const signUpDefaultValues = { name: '', email: '', password: '', confirmPassword: '' };

export const shippingAddressDefaultValues = {
    fullName: '',
    streetAddress: '',
    city: '',
    postalCode: '',
    country: '',
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
    ? process.env.PAYMENT_METHODS.split(', ')
    : ['PayPal', 'Credit Card', 'COD'];
export const DEFAULT_PAYMENT_METHOD =
    process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';
export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 1;


export const productDefaultValues = {
    name: '',
    slug: '',
    category: '',
    brand: '',
    description: '',
    stock: 0,
    rating: '0',
    price: '0',
    images: [],
    numReviews: '0',
    isFeatured: false,
    banner: null,
    sku: '',
    costPrice: '0',
};


//User Roles
export const USER_ROLES = process.env.USER_ROLES ? process.env.USER_ROLES.split(', ') : ['user', 'admin', 'root'];
export const reviewFormDefaultValues = {
    title: '',
    comment: '',
    rating: 0,
};