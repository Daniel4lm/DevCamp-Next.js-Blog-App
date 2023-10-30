"use client"

import { useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { SmallPostCard } from "@/components/posts-comments/CardsComponent"
import Skeleton from "@/components/skeletons/Skeleton"
import { UserPost } from "@/models/Post"

type PageProps = {
    params: {
        tag: string
    }
}

interface PostResultsProps {
    posts: UserPost[]
    totalPages: number
    totalCount: number
}

async function getPosts(page: number, tag: string) {
    const postsFetch = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/tags?tag=${tag}&page=${page}&limit=5`)
    const postsResults = (await postsFetch.json()) as PostResultsProps
    return postsResults
}

export default function PostsListByTag({ params }: PageProps) {

    const { tag } = params
    const [totalCount, setTotalCount] = useState(0)
    const [totalPages, setTotalPages] = useState(0)

    const {
        fetchNextPage,
        isFetching,
        hasNextPage,
        data: userPosts,
        isLoading,
    } = useInfiniteQuery({
        queryKey: [`posts-tag-${tag}`],
        queryFn: async ({ pageParam = 0 }) => {
            const results = await getPosts(pageParam, tag)
            setTotalPages(results.totalPages)
            setTotalCount(results.totalCount)
            return results.posts
        },
        getNextPageParam: (lastPage, allPages) => {
            const nextPage = allPages.length
            return nextPage < totalPages ? nextPage : undefined
        },
    })

    return (
        <>
            <div id="top" className="px-2 my-4 flex flex-col items-center p-4 text-slate-600 dark:text-white shadow-lg dark:shadow-none">
                <h2 className="mx-auto text-xl sm:text-3xl text-center font-semibold uppercase pt-4">#{tag}</h2>
                {isLoading || isFetching ? (
                    <>
                        <Skeleton classes='text width-50 my-2' />
                    </>
                ) : (
                    <h3 className="mx-auto text-base sm:text-lg text-center font-light my-4">
                        {totalCount > 0 ? `Results of ${totalCount} ${totalCount === 1 ? "post" : "posts"}` : `There is no results for ${tag}`}
                    </h3>
                )}
            </div>
            <section className="w-full sm:w-10/12 md:w-2/3 xl:w-3/6 2xl:max-w-[44rem] min-h-[45vh] dark:text-slate-100 mx-auto px-2 xs:px-4 md:px-0 pb-8 mb-1 mt-6 sm:mt-0">
                <div id="posts-list-slug" className="flex flex-col gap-y-4 mt-4">
                    {
                        userPosts?.pages.map((page) => {
                            return page.map((post) => (<SmallPostCard key={post.id} postData={post as UserPost} />))
                        })
                    }
                    {isLoading || isFetching ? (
                        <>
                            {[...Array(4).keys()].map(i => {
                                return (
                                    <div key={`card-${i}-1`} className='border rounded-xl xs:shadow p-1'>
                                        <Skeleton classes='h-40 md:h-20 width-100 mb-2' />
                                        <Skeleton classes='text width-100 my-1' />
                                        <Skeleton classes='text width-100 my-1' />
                                        <Skeleton classes='text width-100 my-1' />
                                    </div>
                                )
                            })}
                        </>
                    ) : null}
                </div>
                <div className="mt-4 p-4">
                    <button
                        id="load-more-posts-btn"
                        className={`w-max flex justify-center items-center mx-auto my-4 px-4 py-2 border rounded-full border-slate-300 text-gray-600 dark:text-white ease-in-out duration-200 hover:text-gray-800 dark:hover:bg-inherit hover:bg-slate-100 hover:ring-2 hover:border-transparent hover:ring-indigo-300 cursor-pointer focus:outline-none
                               ${hasNextPage ? 'flex' : 'hidden'}`}
                        onClick={() => fetchNextPage()}
                    >
                        Load more posts
                    </button>
                </div>
            </section>
        </>
    )
}
