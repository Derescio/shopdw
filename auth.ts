import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/app/db/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';
import { compareSync } from 'bcrypt-ts-edge';
import { cookies } from 'next/headers';
import { NextURL } from 'next/dist/server/web/next-url';


export const config = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60,
        //Reset to one minute for testing
        // maxAge: 60,
    },
    adapter: PrismaAdapter(prisma),

    providers: [
        CredentialsProvider({
            credentials: {
                email: { type: 'email' },
                password: { type: 'password' },
            },
            async authorize(credentials) {
                if (credentials == null) return null
                // Find user in database
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string,
                        // password: credentials.password
                    }
                });
                // Check is user exists
                if (user && user.password) {
                    // Check if password is correct
                    const isPasswordCorrect = compareSync(
                        credentials.password as string,
                        user.password
                    );
                    // If password is correct
                    if (isPasswordCorrect) {

                        return { id: user.id, email: user.email, name: user.name, role: user.role } as any
                    }
                } else {
                    // If user does not exist or password is incorrect
                    return null
                }
            }
        })],
    callbacks: {
        async session({ session, user, trigger, token }: any) {
            session.user.id = token.sub
            session.user.name = token.name;
            session.user.role = token.role;
            //If there is an update, set the user name
            if (trigger === 'update') {
                session.user.name = user.name
            }
            return session
        },
        async jwt({ token, user, trigger, session }: any) {
            if (user) {
                // Assign user properties to the token
                token.id = user.id;
                token.role = user.role;

                if (trigger === 'signIn' || trigger === 'signUp') {
                    const cookiesObject = await cookies();
                    const sessionCartId = cookiesObject.get('sessionCartId')?.value;
                    //console.log(sessionCartId)

                    if (sessionCartId) {
                        const sessionCart = await prisma.cart.findFirst({
                            where: { sessionCartId },
                        });
                        //console.log(sessionCart)
                        if (sessionCart) {
                            // Overwrite any existing user cart
                            await prisma.cart.deleteMany({
                                where: { userId: user.id },
                            });

                            // Assign the guest cart to the logged-in user
                            await prisma.cart.update({
                                where: { id: sessionCart.id },
                                data: { userId: user.id },
                            });
                        }
                    }
                }
            }

            return token;
        },
        authorized({ request, auth }: any) {
            // If the user is not authenticated, redirect to the sign-in page. Array of regex patterns to exclude from the redirect
            const excludedPaths = [
                /\/shipping/,
                /\/payment-method/,
                /\/place-order/,
                /\/profile/,
                /\/user\/(.*)/,
                /\/order\/(.*)/,
                /\/admin/,
            ]
            // Check if the request path matches any of the excluded paths. Req URL OBject
            const pathname = request?.nextUrl?.pathname;
            // console.log(pathname)
            // const { pathname } = request?.nextUrl?.pathname;
            if (!auth && excludedPaths.some((p) => p.test(pathname))) return false;
            //Check if user is not authenticated and the path is  excluded
            // if (!auth?.user && !excludedPaths.some(pattern => pattern.test(pathname))) {
            //     return false;
            // }

            // Check for session cart cookie
            if (!request.cookies.get('sessionCartId')) {
                //Generate a new session cart id cookie
                const sessionCartId = crypto.randomUUID();
                // Clone the request headers and then create a NextResponse object and append the heders
                const newRequestHeaders = new Headers(request.headers);
                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeaders
                    }
                })
                response.cookies.set('sessionCartId', sessionCartId);

                // Return the response with the sessionCartId set
                return response;
            } else { return true }

        }
    },
} satisfies NextAuthConfig

export const {
    handlers, auth, signIn, signOut
} = NextAuth(config)