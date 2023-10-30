import { NextRequest, NextResponse } from "next/server";
import PostTask from "@/lib/posts";

export async function GET(request: NextRequest) {
    try {

        const { searchParams } = new URL(request.url)
        const postId = searchParams.get('postId') as string || ''

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