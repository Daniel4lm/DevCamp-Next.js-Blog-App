import { PostTagIcon, TagIcon } from './Icons'
import { Post } from "@prisma/client"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User as SessionUser } from "next-auth"
import { useState } from 'react'

interface BookmarkPostProps {
    isBookmarked: boolean
    currentUser: SessionUser | undefined
    post: Post
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

function BookmarkPost({ isBookmarked, currentUser, post }: BookmarkPostProps) {

    const [saved, setSaved] = useState(isBookmarked)
    const [delay, setDelay] = useState(false)
    const queryClient = useQueryClient()
    const totalBookmarks = post.totalBookmarks + ((isBookmarked !== saved) ? (saved ? 1 : -1) : 0)

    const createBookmark = useMutation({
        mutationFn: handleBookmark,
        onSuccess: () => {
            setSaved(true)

            queryClient.setQueryData(['post', post.slug],
                (post: any) => {
                    return { ...post, ...{ totalBookmarks: post.totalBookmarks + 1 } }
                }
            )
        },
    })

    const unBookmark = useMutation({
        mutationFn: handleBookmark,
        onSuccess: () => {
            setSaved(false)

            queryClient.setQueryData(['post', post.slug],
                (post: any) => {
                    return { ...post, ...{ totalBookmarks: post.totalBookmarks - 1 } }
                }
            )
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
                    (<div className={`rounded-full p-2 ${saved ? 'text-blue-500 dark:text-blue-500' : ''} cursor-pointer border border-transparent hover:text-blue-500 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-transparent dark:hover:border-transparent`}>
                        <button
                            id={`bookmark-component-${post.id}`}
                            disabled={mutationFunction.isLoading || delay}
                            onClick={changeBookmarkStatus}
                            className="focus:outline-none block"
                        >
                            <PostTagIcon isTaged={saved} />
                        </button>
                    </div>)
                    :
                    (<div id="bookmark-icon" className="px-2 md:px-0 py-2 text-slate-800">
                        <TagIcon />
                    </div>)
                }

                <span id={`bookmarks-count-for-${post.id}`} className="mx-1 sm:mx-2">{post?.totalBookmarks}</span>
            </div>
        </>
    )
}

export default BookmarkPost
