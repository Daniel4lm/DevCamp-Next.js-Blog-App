import { NextRequest, NextResponse } from 'next/server'
import PostTask from '@/lib/posts'

export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url)
    const curPage = searchParams.get('page')
    const limit = searchParams.get('limit') || '5'
    const tag = searchParams.get('tag') || ''

    const curPageNum: number = (Number(curPage) || 0)
    const curLimit: number = (Number(limit) || 5)
    const minRange: number = curPageNum * curLimit

    try {
        const posts = PostTask.getPaginatedPosts(curLimit, minRange, {
            tags: {
                some: {
                    name: tag
                }
            }
        })
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