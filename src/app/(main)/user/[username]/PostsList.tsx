"use client"

import { SmallPostCard } from "@/app/components/CardsComponent"
import { Comment, Post, Profile, Tag, User } from "@prisma/client"
import { useCallback, useEffect, useRef, useState } from "react"

interface PostsListProps {
    user: {
        id: string
        avatarUrl: string | null
        email: string
        username: string
        fullName: string
        postsCount: number
        profile: Profile | null
        posts?: (Post & {
            author: User;
            tags: Tag[]
        })[]
    }
}

interface PostResultsProps {
    posts: (Post & {
        comments: Comment[]
        author: User
        tags: Tag[]
    })[]
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
    const [cursor, setCursor] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [userPosts, setUserPosts] = useState<(Post & {
        comments?: Comment[]
        author: User
        tags: Tag[]
        posts?: (Post & {
            author: User
            tags: Tag[]
        })[]
    })[]>([])

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
                    console.log(results)
                    setCursor(results.posts[results.posts.length - 1].id)
                    if (!ignore) {
                        setUserPosts(prev => [...prev, ...results.posts])
                        setHasNextPage(page < totalPages - 1)
                        setIsLoading(false)
                    }
                })

        } catch (err) {
            console.error(err)
            setIsLoading(false)
            if (controller.signal.aborted) return
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
            <section className="w-full sm:w-10/12 md:w-2/3 xl:w-3/6 min-h-[45vh] dark:text-slate-100 mx-auto px-4 md:px-0 pb-8 mb-1 mt-6 sm:mt-0">
                <div className="px-2 my-4">
                    <h3 className="mx-auto text-center font-medium">Posts</h3>
                </div>
                <div id="user-posts" className="flex flex-col gap-y-4 mt-4">
                    {isLoading && (<div className="loader text-gray-300 dark:text-slate-400"></div>)}
                    {renderPosts}
                </div>
            </section>

            {hasNextPage && (
                <>
                    <div id="infinite-scroll-marker"></div>
                    <div className="loader text-gray-300 dark:text-slate-400"></div>
                </>
            )}
        </>
    )
}

export default PostsList
