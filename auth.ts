import { compareSync } from 'bcrypt-ts-edge';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/app/db/prisma';
import { PrismaAdapter } from '@auth/prisma-adapter';
import type { NextAuthConfig } from 'next-auth';


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
                    const isPasswordCorrect = compareSync(credentials.password as string, user.password)
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
            // Assign user fields to token
            if (user) {
                token.role = user.role;


                // If user has no name, use email as their default name
                if (user.name === 'NO_NAME') {
                    token.name = user.email!.split('@')[0];

                    // Update the user in the database with the new name
                    await prisma.user.update({
                        where: { id: user.id },
                        data: { name: token.name },
                    });
                }
            }

            // Handle session updates (e.g., name change)
            if (session?.user.name && trigger === 'update') {
                token.name = session.user.name;
            }

            return token;
        },
    },
} satisfies NextAuthConfig

export const {
    handlers, auth, signIn, signOut
} = NextAuth(config)