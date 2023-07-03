import { NextRequest, NextResponse } from 'next/server'
import { Post } from "@prisma/client"
import PostTask from '@/lib/posts'
import prisma from '@/lib/db/prismaClient'
import { join } from 'path'
const fs = require('fs');


export async function POST(request: Request) {
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
        if (foundPost.photo_url) maybeRemoveOldImage(foundPost.photo_url)
    }

    console.log('Deleted post: ', deletedPost.id)
    return NextResponse.json({ deletedPost }, { status: 200 })
}

const maybeRemoveOldImage = (imageUrl: string) => {
    let pathArray = imageUrl.split('/')
    let oldImageName = pathArray[pathArray.length - 1]
    console.log(oldImageName)
    let oldImagePath = join('public/uploads/blog/', oldImageName)

    fs.access(oldImagePath, fs.constants.F_OK, (err: any) => {
        if (err) {
            console.log(err)
            return
        } else {
            console.log('removed old image...')
            fs.unlink(oldImagePath, (err: any) => {
                if (err) {
                    console.error(err)
                    return
                }
            })
        }
    })
}
