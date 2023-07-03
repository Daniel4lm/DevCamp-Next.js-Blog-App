import PostTask from '@/lib/posts'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: Request) {

    const { searchParams } = new URL(request.url)

    const curPage = searchParams.get('page')
    const limit = searchParams.get('limit') || '5'
    const tag = searchParams.get('tag') || ''

    console.log('backend...', tag, curPage)

    const curPageNum: number = (Number(curPage) || 0)
    const curLimit: number = (Number(limit) || 5)

    /* Pagination borders */
    const minRange: number = curPageNum * curLimit

    try {
        const posts = PostTask.getPostsByTag(curLimit, minRange, tag)
        const getPostsCount = PostTask.getNumOfTagPosts(tag)

        const [pagePosts, totalCount] = await Promise.all([posts, getPostsCount])
        const numOfPages: number = (Math.ceil(totalCount._count.id / curLimit))

        return NextResponse.json({
            posts: pagePosts,
            totalPages: numOfPages,
            totalCount: totalCount._count.id
        })

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}