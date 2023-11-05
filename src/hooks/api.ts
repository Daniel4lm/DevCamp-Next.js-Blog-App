import { Post, Prisma, Tag, Like, PostBookmark } from "@prisma/client"
import { useMutation, useQuery } from "@tanstack/react-query"
import { PostComment } from "../models/Comment"
import { User } from "@/models/User"

const usePostQuery = (slug: string, condition: boolean = true) => {
    return useQuery({
        queryKey: ['post', slug],
        enabled: condition,
        retry: 4,
        queryFn: async function () {
            const blogFetch = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/${slug}`)
            const postJson = await blogFetch.json()
            return postJson.post as (Post & {
                bookmarks: PostBookmark[]
                comments: PostComment[]
                author: User
                likes: Like[]
                tags: Tag[]
                _count: Prisma.PostCountOutputType;
            })
        },
        // initialData: postData,
    })
}

const useCreatePostMutation = () => {
    const mutation = useMutation(
        async ({ formData, methodType, }: { formData: FormData; methodType: "POST" | "PUT"; }) => {

            const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts`, {
                method: methodType,
                body: formData,
                // headers: {
                //   "Content-Type": "multipart/form-data",
                // },
            });
            return await res.json();
        }
    );

    return mutation;
};

const useUserQuery = (username: string, userData?: User) => {
    return useQuery(useUserQueryData(username, userData))
}

const useUserQueryData = (username: string, userData?: User) => {
    return {
        queryKey: ['user', username],
        enabled: username != null,
        queryFn: async function () {
            const userFetch = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${username}`)
            const userJson = await userFetch.json()
            return userJson.user as User
        },
        initialData: userData,
    }
}

const useFollowingsQuery = (username: string, userId: string) => {
    return useQuery(useFollowingsQueryData(username, userId))
}

const useFollowingsQueryData = (username: string, userId: string) => {
    return {
        queryKey: [`user-${username}-followings`],
        enabled: username != null && userId != null,
        queryFn: async function () {
            const followRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${username}/follow?username=${userId}`)
            const followData = await followRes.json()
            return followData
        },
    }
}

const useCommentsQuery = (postId: string, initialComments?: PostComment[]) => {
    return useQuery({
        queryKey: [`comments-${postId}-post`],
        queryFn: async function () {
            const commentsRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/comments?postId=${postId}`)
            const pComments = await commentsRes.json()
            return pComments.comments as PostComment[]
        },
        initialData: initialComments
    })
}

export { useCommentsQuery, useCreatePostMutation, useFollowingsQuery, usePostQuery, useUserQuery, useUserQueryData, useFollowingsQueryData }