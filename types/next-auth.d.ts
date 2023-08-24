import { DefaultSession, DefaultUser } from "next-auth"
import { JWT, DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
    /**
       * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
       */

    interface User extends DefaultUser {
        id: string,
        email: string,
        fullName: string,
        username: string,
        avatarUrl: string,
        themeMode: string,
        role: 'USER' | 'ADMIN'
    }

    interface Session {
        user: User & DefaultSession["expires"]
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        role: 'USER' | 'ADMIN'
    }
}