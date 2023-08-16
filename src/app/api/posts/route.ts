import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prismaClient'
import PostTask from '@/lib/posts'
import { createSlug } from '@/lib/helperFunctions'
import { maybeRemoveOldImage, maybeUploadImage } from '@/lib/fileHelpers'

export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url)

    const curPage = searchParams.get('page')
    const limit = searchParams.get('limit')
    const username = searchParams.get('username') || undefined

    const curPageNum: number = (Number(curPage) || 0)
    const curLimit: number = (Number(limit) || 5)
    const minRange: number = curPageNum * curLimit

    const posts = PostTask.getPaginatedPosts(curLimit, minRange, { author: { username: username } })

    const getPostsCount = username ? PostTask.getNumOfUserPosts(username) : PostTask.getNumOfRecords()

    const [pagePosts, totalCount] = await Promise.all([posts, getPostsCount])
    const numOfPages: number = (Math.ceil(totalCount._count.id / curLimit))

    return NextResponse.json({
        posts: pagePosts,
        totalPages: numOfPages,
        totalCount: totalCount._count.id
    })
}

export async function PUT(request: NextRequest) {

    try {
        const formData = await request.formData()
        let formEntries = Object.fromEntries(formData)
        const { tags, photoUrl, slug, ...params } = formEntries
        const newSlug = createSlug(params.title as string)

        const postTags = tags ? (tags as string).split(',') : []

        const foundPost = await prisma.post.findUnique({
            where: { slug: slug as string }
        })

        if (!foundPost) {
            return NextResponse.json({ error: 'Blog post not found or data is missing!' }, { status: 404 })
        }

        // if(typeof(params.published) === 'boolean')

        let maybeParamsWithPhoto = params
        maybeParamsWithPhoto["slug"] = newSlug

        const postPhoto = formData.get("photoUrl") as Blob | null
        if (postPhoto && photoUrl !== 'undefined') {
            // const url = request.url.split(':')[0] + '://' + request.headers.get('host')
            maybeParamsWithPhoto = await maybeUploadImage(
                params,
                postPhoto,
                '/uploads/blog/',
                {
                    paramToBeChanged: "photo_url",
                    customFileName: slug + '-' + postPhoto.name.toLowerCase().split(' ').join('-')
                }
            )

            if (foundPost.photo_url) {
                let pathArray = foundPost.photo_url.split('/')
                let oldImageName = pathArray.at(-1) || ''
                maybeRemoveOldImage(oldImageName, 'public/uploads/blog/')
            }
        }

        const updatedPost = await PostTask.updatePost(maybeParamsWithPhoto, postTags, slug as string)
        return NextResponse.json({ updatedPost }, { status: 200 })

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

export async function POST(request: NextRequest) {

    try {
        const formData = await request.formData()
        let formEntries = Object.fromEntries(formData)
        const { userEmail, tags, photoUrl, ...params } = formEntries // await request.json();
        const email = userEmail as string
        const postTags = tags ? (tags as string).split(',') : []

        const foundUser = await prisma.user.findUnique({
            where: { email: email }
        })

        if (!email || !foundUser) {
            return NextResponse.json({ error: 'User not found or email is missing!' }, { status: 404 })
        }

        const alreadyPost = await prisma.post.findUnique({
            where: { slug: params.slug as string }
        })

        if (alreadyPost) {
            return NextResponse.json({ error: 'Blog post already exists!' }, { status: 403 })
        }

        let maybeParamsWithPhoto = params

        const postPhoto = formData.get("photoUrl") as Blob
        if (postPhoto && photoUrl !== 'undefined') {
            // const url = request.url.split(':')[0] + '://' + request.headers.get('host')
            maybeParamsWithPhoto = await maybeUploadImage(
                params,
                postPhoto,
                '/uploads/blog/',
                {
                    paramToBeChanged: "photo_url",
                    customFileName: params.slug + '-' + postPhoto.name.toLowerCase().split(' ').join('-')
                }
            )
        }

        const newPost = await PostTask.createNewPost(maybeParamsWithPhoto, postTags, email)
        return NextResponse.json({ newPost }, { status: 200 })

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