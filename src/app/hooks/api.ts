import { Post, Prisma, Profile, Tag, Like } from "@prisma/client"
import { useQuery } from "@tanstack/react-query"
import { PostComment } from "../models/Comment"
import { User } from "next-auth"

interface UserDataProps {
    id: string
    avatarUrl: string | null
    email: string
    username: string
    fullName: string
    postsCount: number
    role: "user" | "admin"
    profile: Profile | null
    posts?: (Post & {
        author: User;
        tags: Tag[]
    })[],
    followersCount: number
    followingCount: number
}

const usePostQuery = (slug: string) => {
    return useQuery({
        queryKey: ['post', slug],
        queryFn: async function () {
            const blogFetch = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/${slug}`)
            const postJson = await blogFetch.json()
            return postJson.post as (Post & {
                comments: PostComment[]
                author: { [x: string]: string | number | null }
                likes: Like[]
                tags: Tag[]
                _count: Prisma.PostCountOutputType;
            })
        },
        // initialData: postData,
    })
}

const useUserQuery = (username: string, userData?: UserDataProps) => {
    return useQuery({
        queryKey: ['user', username],
        enabled: username != null,
        queryFn: async function () {
            const userFetch = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${username}`)
            const userJson = await userFetch.json()
            return userJson.user
        },
        initialData: userData,
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

const useFollowingsQuery = (username: string, userId: string) => {
    return useQuery({
        queryKey: [`user-${username}-followings`],
        enabled: username != null && userId != null,
        queryFn: async function () {
            const followRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${username}/follow?username=${userId}`)
            const followData = await followRes.json()
            return followData
        },
    })
}


export { useCommentsQuery, useFollowingsQuery, usePostQuery, useUserQuery }