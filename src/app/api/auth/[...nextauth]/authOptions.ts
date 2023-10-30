import type { NextAuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import prisma from '@/lib/db/prismaClient'
import { compareSync } from "bcryptjs"

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 days
        updateAge: 24 * 60 * 60 // 24h
    },
    pages: {
        signIn: "/auth/login",
        signOut: "/auth/logout"
    },
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        CredentialsProvider({
            id: "db_provider",
            name: "DBAuth",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "Your username..." },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {

                const { username, password } = credentials ?? {}

                if (!username || !password) {
                    throw new Error("Missing username or password");
                }

                try {
                    const foundUser = await prisma.user.findUnique({
                        where: {
                            username: username
                        },
                        include: {
                            profile: true
                        }
                    })

                    if (foundUser && compareSync(password, foundUser?.hashedPassword)) {
                        // Any object returned will be saved in `user` property of the JWT
                        return {
                            id: foundUser.id,
                            email: foundUser.email,
                            fullName: foundUser.fullName,
                            username: foundUser.username,
                            avatarUrl: foundUser.avatarUrl,
                            themeMode: foundUser.profile?.themeMode,
                            fontName: foundUser.profile?.fontName,
                            profileVisited: foundUser.profile?.profileVisited,
                            kanbanColumnsReviewed: foundUser.profile?.kanbanColumnsReviewed,
                            role: foundUser.role
                        } as User
                    }
                    // If we return null then an error will be displayed advising the user to check their details.
                    // We can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
                    throw new Error("Invalid username or password!")
                } catch (err) {
                    throw new Error(err as any)
                }
            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            return true
        },
        jwt: async ({ token, user, session, trigger }) => {
            const tokenUser = (token.user || user) as User
            if (tokenUser) {
                // const tokenUser = user as User
                token.user = tokenUser
                token.role = tokenUser.role
            }

            if (trigger === 'update' && session.user) {
                token.user = session.user
            }

            return token
        },
        session: async ({ session, token }) => {
            return {
                ...session,
                user: token.user as User
            }
        }
    }
}
