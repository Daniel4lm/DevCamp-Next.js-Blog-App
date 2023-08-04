import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    // `withAuth` augments your `Request` with the user's token.
    function middleware(req: NextRequestWithAuth) {

        const userRole = req.nextauth.token?.role
        const path = "/posts/new" || "/posts/edit" || "/settings/account" || "/settings/password"

        if (req.nextUrl.pathname.includes(path) && !['user', 'admin'].includes(userRole || '')) {
            return NextResponse.rewrite(new URL('/denied', req.url))
        }

        if (req.nextUrl.pathname.includes("/dashboard") && userRole !== 'admin') {
            return NextResponse.rewrite(new URL('/denied', req.url))
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
    }
)

export const config = {
    // matcher: ["/((?!register|kapi|login).*)"],
    matcher: [
        "/dashboard",
        "/posts/new",
        "/posts/edit",
        "/settings/account/(.*)",
        "/settings/password/(.*)"
    ],
}
