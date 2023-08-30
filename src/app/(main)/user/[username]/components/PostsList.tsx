"use client"

import { SmallPostCard } from "@/components/posts-comments/CardsComponent"
import UserPostsSkeleton from "@/components/skeletons/UserPostsSkeleton"
import { UserPost } from "@/models/Post"
import { User } from "@/models/User"
import { useCallback, useEffect, useRef, useState } from "react"

interface PostsListProps {
    user: User
}

interface PostResultsProps {
    posts: UserPost[]
    totalPages: number
    totalCount: number
}

async function getPosts(page: number, username: string, cursor?: string) {
    const postsRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts?page=${page}&username=${username}&cursor=${cursor}`)
    const postResults = (await postsRes.json()) as PostResultsProps
    return postResults
}

const PostsList = ({ user }: PostsListProps) => {
    const [page, setPage] = useState(0)
    const [hasNextPage, setHasNextPage] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [userPosts, setUserPosts] = useState<UserPost[]>([])

    let intersObserver = useRef<IntersectionObserver | null>()

    const lastPostRef = useCallback((postCard: HTMLDivElement) => {

        if (intersObserver.current) intersObserver.current.disconnect()

        intersObserver.current = new IntersectionObserver((entries) => {
            const target = entries[0]
            if (target.isIntersecting && hasNextPage) {
                setTimeout(() => {
                    setPage(pageNum => pageNum + 1)
                }, 500);
            }
        },
            {
                root: null,
                threshold: 1.0,
            })

        if (postCard) intersObserver.current.observe(postCard)

    }, [hasNextPage])

    useEffect(() => {
        let ignore = false
        setIsLoading(true)
        const controller = new AbortController()
        let totalPages = Math.ceil(user.postsCount / 5)

        try {
            getPosts(page, user.username)
                .then(results => {
                    if (!ignore) {
                        setUserPosts(prev => [...prev, ...results.posts])
                        setHasNextPage(page < totalPages - 1)
                        setIsLoading(false)
                    }
                })

        } catch (err) {
            if (controller.signal.aborted) return
            console.error(err)
            setIsLoading(false)
        }

        return () => {
            controller.abort()
            ignore = true
        }
    }, [page, user.postsCount, user.username])

    const renderPosts = userPosts?.map((post, index) => {
        if (userPosts.length === index + 1) {
            return <SmallPostCard ref={lastPostRef} key={post.id} postData={post} />
        }
        return <SmallPostCard key={post.id} postData={post} />
    })

    return (
        <>
            {isLoading && !userPosts.length ? (<UserPostsSkeleton />) :
                (
                    <>
                        <section className="w-full sm:w-10/12 md:w-2/3 xl:w-3/6 min-h-[45vh] dark:text-slate-100 mx-auto px-4 md:px-0 pb-8 mb-1 mt-6 sm:mt-0">
                            <div className="px-2 my-8">
                                <h3 className="text-gray-800 text-lg xs:text-2xl dark:text-slate-100 font-medium">
                                    All posts from <span className="border-b-4 border-indigo-400 dark:border-indigo-300">{user.fullName}</span>
                                </h3>
                            </div>
                            <div id="user-posts" className="flex flex-col gap-y-4 mt-4">
                                {isLoading ? (<div className="loader text-gray-300 dark:text-slate-400"></div>) : null}
                                {renderPosts}
                            </div>
                        </section>
                        {isLoading || !userPosts.length ? (<UserPostsSkeleton />) : null}

                        {hasNextPage ? (
                            <div id="infinite-scroll-marker" className="h-24"></div>
                        ) : null}
                    </>
                )
            }

        </>
    )
}

export default PostsList
