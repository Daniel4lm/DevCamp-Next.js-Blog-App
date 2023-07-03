import PostTask from "@/lib/posts"
import { NextResponse } from "next/server"
import prisma from '@/lib/db/prismaClient'

export async function POST(request: Request) {
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

export async function PUT(request: Request) {
    try {
        const formData = await request.formData();
        let editEntries = Object.fromEntries(formData)
        console.log('edit params...', editEntries)
        
        const foundComment = await prisma.comment.findUnique({
            where: { id: editEntries.id as string }
        })

        if (!foundComment) {
            return NextResponse.json({ error: 'Blog comment not found or data is missing!' }, { status: 404 })
        }

        const updatedComment = await PostTask.updateComment(editEntries)
        console.log('Updated post: ', updatedComment.id)
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