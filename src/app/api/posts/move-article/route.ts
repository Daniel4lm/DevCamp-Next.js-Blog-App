import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db/prismaClient";
import PostTask from "@/lib/posts";

export async function POST(request: NextRequest) {

    const { articleId, columnType } = await request.json()

    try {

        const foundPost = await prisma.post.findUnique({
            where: { id: articleId as string },
            include: {
                boardColumn: true
            }
        })

        if (!foundPost || foundPost.boardColumn.type === columnType) {
            return NextResponse.json({ error: 'Blog post not found or board column is not changed!' }, { status: 404 })
        }

        await PostTask.moveArticle(articleId, columnType)
        return NextResponse.json({ message: 'Article successfully moved to another category' }, { status: 200 })

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