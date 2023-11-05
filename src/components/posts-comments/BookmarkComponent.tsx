import { UserPost } from '@/models/Post'
import { PostTagIcon, TagIcon } from '../Icons'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User as SessionUser } from "next-auth"
import { useState } from 'react'

interface BookmarkPostProps {
    isBookmarked: boolean
    currentUser: SessionUser | undefined
    post: UserPost,
    showCounter?: boolean
    outerFunc?: (value: string | number | undefined) => void
}

interface HandleLikeProps {
    userId: string,
    postId: string,
    method: 'POST' | 'DELETE'
}

async function handleBookmark({ userId, postId, method }: HandleLikeProps) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/favorites`, {
        method: method,
        body: JSON.stringify({ userId, postId })
    })
    return await res.json()
}

function BookmarkPost({ isBookmarked, currentUser, post, showCounter = false, outerFunc }: BookmarkPostProps) {

    const [saved, setSaved] = useState(isBookmarked)
    const [delay, setDelay] = useState(false)
    const queryClient = useQueryClient()
    const totalBookmarks = post.totalBookmarks + ((isBookmarked !== saved) ? (saved ? 1 : -1) : 0)

    const createBookmark = useMutation({
        mutationFn: handleBookmark,
        onSuccess: async () => {
            setSaved(true)
            outerFunc && outerFunc(post.id)
            const queryPost = await queryClient.getQueryData(['post', post.slug])

            if (queryPost) {
                queryClient.setQueryData(['post', post.slug],
                    (post: any) => {
                        return { ...post, ...{ totalBookmarks: post.totalBookmarks + 1 } }
                    }
                )
            }
        },
    })

    const unBookmark = useMutation({
        mutationFn: handleBookmark,
        onSuccess: async () => {
            setSaved(false)
            outerFunc && outerFunc(post.id)
            const queryPost = await queryClient.getQueryData(['post', post.slug])

            if (queryPost) {
                queryClient.setQueryData(['post', post.slug],
                    (post: any) => {
                        return { ...post, ...{ totalBookmarks: post.totalBookmarks - 1 } }
                    }
                )
            }
        },
    })

    const mutationFunction = saved ? unBookmark : createBookmark

    const changeBookmarkStatus = () => {
        setDelay(true)

        setTimeout(() => { setDelay(false) }, 2000)

        mutationFunction.mutate({
            userId: currentUser?.id || '',
            postId: post.id,
            method: saved ? 'DELETE' : 'POST'
        })
    }

    return (
        <>
            <div className='flex sm:flex-col py-1 items-center' >
                {currentUser && currentUser.id !== post?.authorId ?
                    (<div className={`rounded-full p-2 ${saved ? 'text-sky-500 dark:text-sky-500' : ''} cursor-pointer border border-transparent dark:text-slate-100 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-transparent dark:hover:border-transparent`}>
                        <button
                            id={`bookmark-component-${post.id}`}
                            disabled={mutationFunction.isLoading || delay}
                            onClick={changeBookmarkStatus}
                            className="focus:outline-none block"
                            data-testid="bookmark-post-component"
                        >
                            <PostTagIcon isTaged={saved} />
                        </button>
                    </div>)
                    :
                    (<div data-testid="bookmark-post-icon" id="bookmark-icon" className="px-2 md:px-0 py-2 text-slate-800 dark:text-slate-500">
                        <PostTagIcon isTaged={saved} />
                    </div>)
                }
                {showCounter ? (
                    <span id={`bookmarks-count-for-${post.id}`} className="mx-1 sm:mx-2">{post?.totalBookmarks}</span>
                ) : null}
            </div>
        </>
    )
}

export default BookmarkPost
