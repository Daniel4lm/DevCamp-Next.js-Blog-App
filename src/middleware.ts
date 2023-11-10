import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(

    function middleware(req: NextRequestWithAuth) {

        const userRole = req.nextauth.token?.role

        function checkPaths(reqPathname: string) {
            const paths = ["/posts/new", "/posts/edit", "/settings/account", "/settings/password"]
            return paths.some(path => reqPathname.includes(path))
        }

        if (checkPaths(req.nextUrl.pathname) && !['USER', 'ADMIN'].includes(userRole || '')) {
            return NextResponse.rewrite(new URL('/denied', req.url))
        }

        if (req.nextUrl.pathname.includes("/dashboard") && userRole !== 'ADMIN') {
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
        "/auth/logout",
        "/dashboard",
        "/posts/new",
        "/posts/edit",
        "/posts/kanban",
        "/settings/account/(.*)"
    ],
}
