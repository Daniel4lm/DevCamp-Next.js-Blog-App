import { Post, Prisma, Tag } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { PostComment } from "../models/Comment"

const usePostQuery = (slug: string) => {
    return useQuery({
        queryKey: ['post', slug],
        queryFn: async function () {
            const blogFetch = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/${slug}`)
            const postJson = await blogFetch.json()
            return postJson.post as (Post & {
                comments: PostComment[]
                author: { [x: string]: string | number | null }
                tags: Tag[]
                _count: Prisma.PostCountOutputType;
            })
        },
        // initialData: postData,
    })
}

const useCommentsQuery = (postId: string, initialComments: PostComment[]) => {
    return useQuery({
        queryKey: [`comments-${postId}-post`],
        queryFn: async function () {
            const commentsRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/comments?postId=${postId}`)
            const pComments = await commentsRes.json()
            return pComments.comments as PostComment[]
        },
        // initialData: initialComments
    })
}


export { usePostQuery, useCommentsQuery }