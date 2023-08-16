import { NextRequest, NextResponse } from 'next/server'
import { Post } from "@prisma/client"
import PostTask from '@/lib/posts'
import prisma from '@/lib/db/prismaClient'
import { maybeRemoveOldImage } from '@/lib/fileHelpers'

export async function POST(request: NextRequest) {
    const { id }: Pick<Post, "id"> = await request.json()

    if (!id) {
        return NextResponse.json({ error: 'Blog post ID not provided!' }, { status: 405 })
    }

    const foundPost = await prisma.post.findUnique({
        where: { id: id }
    })

    if (!foundPost) {
        return NextResponse.json({ error: 'Post not found or ID is not valid!' }, { status: 404 })
    }

    const deletedPost = await PostTask.deletePost(id)

    if (foundPost.photo_url) {
        let pathArray = foundPost.photo_url.split('/')
        let oldImageName = pathArray.at(-1) || ''
        maybeRemoveOldImage(oldImageName, 'public/uploads/blog/')
    }

    return NextResponse.json({ deletedPost }, { status: 200 })
}
