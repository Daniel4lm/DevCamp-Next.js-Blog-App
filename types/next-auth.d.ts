import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
    /**
       * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
       */
    interface Session {
        user: {
            id: string,
            email: string,
            fullName: string,
            username: string,
            avatarUrl: string,
            themeMode: string,
            role: 'user' | 'admin'
        } & DefaultSession["expires"]
    }

    // interface User extends DefaultUser {
    //     id: string,
    //     email: string,
    //     fullName: string,
    //     username: string,
    //     avatarUrl: string,
    //     role: string
    // }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        role: 'user' | 'admin'
    }
}