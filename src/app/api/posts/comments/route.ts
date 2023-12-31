import PostTask from "@/lib/posts";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {

        const { searchParams } = new URL(request.url)
        const postId = searchParams.get('postId') as string || ''

        console.info('comments -> params: ', postId)

        const comments = await PostTask.getAllPostComments(postId)
        return NextResponse.json({ comments }, { status: 200 })

    } catch (err: any) {
        let error_response = {
            status: "error",
            message: err.message,
        };
        return new NextResponse(JSON.stringify(error_response), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}