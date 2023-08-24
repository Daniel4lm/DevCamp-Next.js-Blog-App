import { NextRequest, NextResponse } from 'next/server'
import PostTask from "@/lib/posts"

export async function POST(request: NextRequest) {

    const { userId, resourceType, resourceId } = await request.json()
    let isLiked

    try {
        if (resourceType === 'post') {
            isLiked = await PostTask.isPostLiked(userId, resourceId)
            if (isLiked) return NextResponse.json({ error: 'Blog post is already liked!' }, { status: 409 })
        } else if (resourceType === 'comment') {
            isLiked = await PostTask.isCommentLiked(userId, resourceId)
            if (isLiked) return NextResponse.json({ error: 'Blog post is already liked!' }, { status: 409 })
        }

        const like = await PostTask.createLike(userId, resourceId, resourceType)
        return NextResponse.json({ like: like }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function DELETE(request: NextRequest) {

    const { userId, resourceType, resourceId } = await request.json()

    try {
        const like = await PostTask.deleteLike(userId, resourceId, resourceType)
        return NextResponse.json({ like: like }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
