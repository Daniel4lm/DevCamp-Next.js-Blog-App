import { headers } from "next/dist/client/components/headers"
import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { filename: string } }) {

    const fileName = params?.filename

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/uploads/blog/${fileName}`)

        return new Response(
            response.body,
            {
                headers: {
                    ...response.headers,
                    "Content-Disposition": `attachment; filename="${fileName}"`
                }
            }
        )
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}