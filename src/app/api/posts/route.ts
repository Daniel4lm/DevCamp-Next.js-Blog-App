import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db/prismaClient'
import PostTask from '@/lib/posts'
import { createSlug } from '@/lib/helperFunctions'
import { maybeRemoveOldImage, maybeUploadImage } from '@/lib/fileHelpers'
import { UserPost } from '@/models/Post'

function postCriteriaQuery(criteria: 'all' | 'starred' | string, username: string | undefined) {
    switch (criteria) {
        case 'all':
            return {
                author: {
                    username: username
                }
            }
        case 'starred':
            return {
                bookmarks: {
                    some: {
                        author: {
                            username: username
                        }
                    }
                }
            }
    }
}

export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url)

    const curPage = searchParams.get('page')
    const limit = searchParams.get('limit')
    const term = searchParams.get('term') || undefined
    const username = searchParams.get('username') || undefined
    const postCriteria = searchParams.get('postCriteria') || 'all'

    const curPageNum: number = (Number(curPage) || 0)
    const curLimit: number = (Number(limit) || 5)
    const minRange: number = curPageNum * curLimit

    let postQuery = {
        ...postCriteriaQuery(postCriteria, username),
        ...{
            OR: [
                {
                    title: {
                        contains: term,
                        mode: 'insensitive'
                    }
                },
                {
                    tags: {
                        some: {
                            name: {
                                contains: term,
                                mode: 'insensitive'
                            }
                        }
                    }
                }
            ]
        }
    }

    const posts = PostTask.getPaginatedPosts(curLimit, minRange, postQuery)

    const getPostsCount = username ? PostTask.getNumOfUserPosts(username) : PostTask.getNumOfRecords()

    const [pagePosts, totalCount] = await Promise.all([posts, getPostsCount])
    const numOfPages: number = (Math.ceil(pagePosts.count.id / curLimit))

    return NextResponse.json({
        posts: pagePosts.posts,
        totalPages: numOfPages,
        totalCount: pagePosts.count.id
    })
}

export async function PUT(request: NextRequest) {

    try {
        const formData = await request.formData()
        let formEntries = Object.fromEntries(formData)
        const { tags, photoUrl, slug, ...params } = formEntries
        const newSlug = createSlug(params.title as string)
        const published = formEntries.published === 'true' ? true : false
        const postTags = tags ? (tags as string).split(',') : []

        const foundPost = await prisma.post.findUnique({
            where: { slug: slug as string }
        })

        if (!foundPost) {
            return NextResponse.json({ error: 'Blog post not found or data is missing!' }, { status: 404 })
        }

        let maybeParamsWithPhoto: { [k: string]: string | File | boolean } = params
        maybeParamsWithPhoto["slug"] = newSlug

        const postPhoto = formData.get("photoUrl") as File | null
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

        maybeParamsWithPhoto = { ...maybeParamsWithPhoto, published: published }
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
        const published = formEntries.published === 'true' ? true : false
        const postTags = tags ? (tags as string).split(',') : []

        const foundUser = await prisma.user.findUnique({
            where: { email: email }
        })

        if (!email || !foundUser) return NextResponse.json({ error: 'User not found or email is missing!' }, { status: 404 })

        const alreadyPost = await prisma.post.findUnique({
            where: { slug: params.slug as string }
        })

        if (alreadyPost) return NextResponse.json({ error: 'Blog post already exists!' }, { status: 403 })

        //let maybeParamsWithPhoto = params
        let maybeParamsWithPhoto: { [k: string]: string | File | boolean } = params

        const postPhoto = formData.get("photoUrl") as File
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

        maybeParamsWithPhoto = { ...maybeParamsWithPhoto, published: published }

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

export async function DELETE(request: NextRequest) {
    const { id }: Pick<UserPost, "id"> = await request.json()

    if (!id) return NextResponse.json({ error: 'Blog post ID not provided!' }, { status: 405 })

    const foundPost = await prisma.post.findUnique({
        where: { id: id }
    })

    if (!foundPost) return NextResponse.json({ error: 'Post not found or ID is not valid!' }, { status: 404 })

    const deletedPost = await PostTask.deletePost(id)

    if (foundPost.photo_url) {
        let pathArray = foundPost.photo_url.split('/')
        let oldImageName = pathArray.at(-1) || ''
        maybeRemoveOldImage(oldImageName, 'public/uploads/blog/')
    }

    return NextResponse.json({ deletedPost }, { status: 200 })
}