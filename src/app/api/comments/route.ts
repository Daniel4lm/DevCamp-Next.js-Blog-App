import { NextRequest, NextResponse } from "next/server"
import prisma from '@/lib/db/prismaClient'
import PostTask from "@/lib/posts"

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const content = formData.get('content') as string || ''
        const postId = formData.get('postId') as string || ''
        const authorId = formData.get('authorId') as string || ''
        const replyId = formData.get('replyId') as string || ''

        const comment = await PostTask.createComment(content, authorId, postId, replyId)
        return NextResponse.json({ comment }, { status: 200 })
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

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData();
        let editEntries = Object.fromEntries(formData)

        const foundComment = await prisma.comment.findUnique({
            where: { id: editEntries.id as string }
        })

        if (!foundComment) return NextResponse.json({ error: 'Blog comment not found or data is missing!' }, { status: 404 })

        const updatedComment = await PostTask.updateComment(editEntries)
        return NextResponse.json({ updatedComment }, { status: 200 })

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

export async function DELETE(request: NextRequest) {

    const { commentId } = await request.json()

    try {
        const comment = await PostTask.deleteComment(commentId)
        return NextResponse.json({ comment: comment }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}