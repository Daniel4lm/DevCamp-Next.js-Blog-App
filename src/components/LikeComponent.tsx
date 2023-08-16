import { HeartIcon, LikeIcon } from './Icons'
import { Post, Comment } from "@prisma/client"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User as SessionUser } from "next-auth"
import { useState } from 'react'

interface LikeComponentProps {
    isLiked: boolean
    currentUser: SessionUser | undefined
    resource: Post | Comment & { slug?: string; }
    resourceType: 'post' | 'comment'
}

interface HandleLikeProps {
    userId: string,
    resourceId: string,
    resourceType: 'post' | 'comment',
    method: 'POST' | 'DELETE'
}

const LikeStyle = {
    post: 'flex sm:flex-col py-1 items-center',
    comment: 'flex items-center gap-1'
}

async function handleLike({ userId, resourceId, resourceType, method }: HandleLikeProps) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/likes/`, {
        method: method,
        body: JSON.stringify({ userId, resourceId, resourceType })
    })
    return await res.json()
}

function LikeComponent({ isLiked, currentUser, resource, resourceType }: LikeComponentProps) {

    const [liked, setLiked] = useState(isLiked)
    const [delay, setDelay] = useState(false)
    const queryClient = useQueryClient()
    const totalLikes = resource.totalLikes + ((isLiked !== liked) ? (liked ? 1 : -1) : 0)

    const likeMutation = useMutation({
        mutationFn: handleLike,
        onSuccess: () => {
            setLiked(true)

            if (resourceType === 'post') {
                queryClient.setQueryData(['post', resource.slug],
                    (post: any) => {
                        return { ...post, ...{ totalLikes: post.totalLikes + 1 } }
                    }
                )
            }
        },
    })

    const unlikeMutation = useMutation({
        mutationFn: handleLike,
        onSuccess: () => {
            setLiked(false)

            if (resourceType === 'post') {
                queryClient.setQueryData(['post', resource.slug],
                    (post: any) => {
                        return { ...post, ...{ totalLikes: post.totalLikes - 1 } }
                    }
                )
            }
        },
    })

    const mutationFunction = liked ? unlikeMutation : likeMutation

    const changeLikeStatus = () => {
        setDelay(true)

        setTimeout(() => { setDelay(false) }, 2000)

        mutationFunction.mutate({
            userId: currentUser?.id || '',
            resourceId: resource.id,
            resourceType: resourceType,
            method: liked ? 'DELETE' : 'POST'
        })
    }

    return (
        <>
            <div className={`${LikeStyle[resourceType as keyof typeof LikeStyle]}`} >
                {currentUser && currentUser.id !== resource?.authorId ?
                    (<div className={`rounded-full ${resourceType === 'post' ? 'p-2 hover:border-indigo-300 hover:bg-indigo-50' : ''} cursor-pointer border border-transparent dark:hover:bg-transparent dark:hover:border-transparent`}>
                        <button
                            id={`like-component-${resource.id}`}
                            disabled={mutationFunction.isLoading || delay}
                            onClick={changeLikeStatus}
                            className="focus:outline-none block text-slate-800 hover:text-[#6B78F3]"
                        >
                            <LikeIcon liked={liked} />
                        </button>
                    </div>)
                    :
                    (<div id="like-icon" className="px-2 md:px-0 py-2 text-slate-800">
                        <HeartIcon />
                    </div>)
                }
                {resourceType === 'comment' ? (
                    <span id={`likes-count-for-${resource.id}`} className="mx-1">{totalLikes} like{totalLikes > 1 && "s"}</span>
                ) : (
                    <span id={`likes-count-for-${resource.id}`} className="mx-1 sm:mx-2">{resource?.totalLikes}</span>
                )}
            </div>
        </>
    )
}

export default LikeComponent
