import { NextRequest, NextResponse } from 'next/server'
import { mkdir, stat, writeFile } from 'fs/promises'
import prisma from '@/lib/db/prismaClient'
import PostTask from '@/lib/posts'
import { join } from 'path'
import { createSlug } from '@/lib/helperFunctions'
// import { Post } from '@prisma/client';
const fs = require('fs')

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url)

    const curPage = searchParams.get('page')
    const limit = searchParams.get('limit')
    const username = searchParams.get('username') || undefined

    const curPageNum: number = (Number(curPage) || 0)
    const curLimit: number = (Number(limit) || 5)

    /* Pagination borders */
    const minRange: number = curPageNum * curLimit

    const posts = PostTask.getPaginatedPosts(curLimit, minRange, username)

    const getPostsCount = username ? PostTask.getNumOfUserPosts(username) : PostTask.getNumOfRecords()

    const [pagePosts, totalCount] = await Promise.all([posts, getPostsCount])
    const numOfPages: number = (Math.ceil(totalCount._count.id / curLimit))

    return NextResponse.json({
        posts: pagePosts,
        totalPages: numOfPages,
        totalCount: totalCount._count.id
    })
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

const maybeUploadPostPhoto = async (params: { [k: string]: FormDataEntryValue }, postPhoto: Blob, url: string) => {
    const buffer = Buffer.from(await postPhoto.arrayBuffer());
    const imageFileName = params.slug + '-' + postPhoto.name.toLowerCase().split(' ').join('-')
    console.log(imageFileName)
    // const filepath = join('public/images/users/', imageFileName)
    // console.log(filepath)
    const uploadDir = join(process.cwd(), "public/uploads/blog/")
    console.log(uploadDir)

    // create dir
    try {
        await stat(uploadDir);
    } catch (e: any) {
        if (e.code === "ENOENT") {
            await mkdir(uploadDir, { recursive: true });
        } else {
            console.error("Error while trying to create directory when uploading a file\n", e);
        }
    }

    // write image 
    try {
        await writeFile(`${uploadDir}/${imageFileName}`, buffer);
    } catch (e) {
        console.error("Error while trying to upload a file\n", e);
    }

    // params["photo_url"] = url + '/uploads/blog/' + imageFileName
    params["photo_url"] = '/uploads/blog/' + imageFileName
    return params
}

export async function PUT(request: Request) {
    console.log('PUT...')
    try {
        const formData = await request.formData()
        let formEntries = Object.fromEntries(formData)
        const { tags, photoUrl, slug, ...params } = formEntries
        const newSlug = createSlug(params.title as string)

        const postTags = tags ? (tags as string).split(',') : []
        console.log('edit params...')
        console.log('tags...', postTags)

        const foundPost = await prisma.post.findUnique({
            where: { slug: slug as string }
        })

        console.log('Found podt ...', foundPost?.id)

        if (!foundPost) {
            return NextResponse.json({ error: 'Blog post not found or data is missing!' }, { status: 404 })
        }

        // if(typeof(params.published) === 'boolean')

        let maybeParamsWithPhoto = params
        maybeParamsWithPhoto["slug"] = newSlug

        const postPhoto = formData.get("photoUrl") as Blob | null
        if (postPhoto && photoUrl !== 'undefined') {
            console.log('Xes, I have an image...')
            const url = request.url.split(':')[0] + '://' + request.headers.get('host')
            maybeParamsWithPhoto = await maybeUploadPostPhoto(params, postPhoto, url)

            if (foundPost.photo_url) maybeRemoveOldImage(foundPost.photo_url)
        }

        const updatedPost = await PostTask.updatePost(maybeParamsWithPhoto, postTags, slug as string)
        console.log('Updated post: ', updatedPost.id)
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

export async function POST(request: Request) {

    try {
        const formData = await request.formData()
        let formEntries = Object.fromEntries(formData)

        const { userEmail, tags, photoUrl, ...params } = formEntries // await request.json();
        const email = userEmail as string
        const postTags = tags ? (tags as string).split(',') : []

        console.log('New post params...')

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

        const postPhoto = formData.get("photoUrl") as Blob | null
        if (postPhoto && photoUrl !== 'undefined') {
            console.log('Yes, I have an image...')
            const url = request.url.split(':')[0] + '://' + request.headers.get('host')
            maybeParamsWithPhoto = await maybeUploadPostPhoto(params, postPhoto, url)
        }

        const newPost = await PostTask.createNewPost(maybeParamsWithPhoto, postTags, email)
        console.log('New post: ', newPost.id)
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