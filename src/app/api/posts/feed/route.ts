import { NextRequest, NextResponse } from "next/server"
import PostTask from "@/lib/posts"
import UserTask from "@/lib/user"

export async function GET(request: NextRequest) {

    const { searchParams } = new URL(request.url)

    const curPage = Number(searchParams.get('page')) || 0
    const limit = Number(searchParams.get('limit')) || 6
    const term = searchParams.get('term') === 'undefined' ? undefined : searchParams.get('term')

    const minRange: number = (curPage - 1) * limit

    const posts = PostTask.getPaginatedPosts(limit, minRange,
        {
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
    )

    const getPostsCount = PostTask.getNumOfRecords(
        {
            title: {
                contains: term,
                mode: 'insensitive'
            }
        }
    )

    const users = UserTask.getUsers({
        OR: [{
            username: {
                contains: term,
                mode: 'insensitive'
            }
        },
        {
            fullName: {
                contains: term,
                mode: 'insensitive'
            }
        }]
    })

    const [pagePosts, totalCount, foundUsers] = await Promise.all([posts, getPostsCount, users])
    const numOfPages: number = Math.ceil(totalCount._count.id / limit)

    return NextResponse.json({
        posts: pagePosts,
        totalPages: numOfPages,
        foundUsers: foundUsers
    })
}