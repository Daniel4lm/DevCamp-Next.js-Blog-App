"use client"

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react"
import { SearchIcon } from "@/components/Icons"
import { StarredPostCard } from "@/components/posts-comments/CardsComponent"
import { UserPost } from "@/models/Post"
import { User } from "@/models/User"
import { User as SessionUser } from "next-auth"
import { mergeUrlParams } from "@/lib/helperFunctions"
import { usePathname, useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import Skeleton from "@/components/skeletons/Skeleton"

interface PostsListProps {
    user: User,
    currentUser: SessionUser | undefined,
    section: string
}

interface PostResultsProps {
    posts: UserPost[]
    totalPages: number
    totalCount: number
}

async function getPosts(params: { [key: string]: string | number | undefined }) {
    const urlQuery = mergeUrlParams(params)
    const postsRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts?${urlQuery}`)
    const postResults = (await postsRes.json()) as PostResultsProps
    return postResults
}

function StarredList({ user, currentUser, section }: PostsListProps) {

    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const tab = searchParams.get('tab') || undefined
    const submit = searchParams.get('submit') || ""

    const [pagePagination, setPagePagination] = useState({
        page: 0,
        totalPosts: 0,
        hasNextPage: false
    })
    const [isLoading, setIsLoading] = useState(false)
    const [formValue, setFormValue] = useState(submit)
    const [userPosts, setUserPosts] = useState<UserPost[]>([])
    const fetchRun = useRef(false)

    function fetchPosts(params: { [key: string]: string | number | undefined }, controller?: AbortController) {
        setIsLoading(true)
        try {
            getPosts(params)
                .then(results => {
                    let totalPages = Math.ceil(results.totalCount / 4)
                    setUserPosts(prev => {
                        if (pagePagination.page > 0) {
                            return [...prev, ...results.posts]
                        } else {
                            return [...results.posts]
                        }
                    })

                    setIsLoading(false)
                    setPagePagination({
                        ...pagePagination, ...{
                            totalPosts: results.totalCount,
                            hasNextPage: pagePagination.page < totalPages - 1
                        }
                    })
                })

        } catch (err) {
            if (controller?.signal.aborted) return
            console.error(err)
            setIsLoading(false)
        }
    }

    useEffect(() => {
        const controller = new AbortController()

        if (fetchRun.current) {
            fetchPosts({
                page: pagePagination.page,
                username: user.username,
                postCriteria: section,
                limit: 4,
                term: submit
            }, controller)
        }

        return () => {
            controller.abort()
            fetchRun.current = true
        }
    }, [pagePagination.page, submit])

    function loadMorePosts() {
        setPagePagination({ ...pagePagination, ...{ page: pagePagination.page + 1 } })
    }

    function onFormSubmit(event: FormEvent) {
        event.preventDefault()

        if (!formValue && !submit) return

        setPagePagination({ ...pagePagination, ...{ page: 0 } })
        setTimeout(() => {
            router.push(`${pathname}?tab=${tab}&submit=${formValue}`, { scroll: false })
        }, 1000)
    }

    const onFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget
        setFormValue(value)
    }

    function resetForm() {
        setFormValue("")
        setTimeout(() => {
            router.push(`${pathname}?tab=${tab}`)
        }, 1000)
    }

    function renderResultsLine() {
        return (
            <div className="flex justify-between items-center my-4">
                <h1 className="w-max text-lg"><b>{pagePagination.totalPosts}</b> articles matching <b>{submit}</b></h1>
                <div className="flex gap-1 justify-end xs:justify-center items-center text-sm dark:text-slate-300 hover:text-sky-500 hover:dark:text-sky-500 cursor-pointer"
                    onClick={resetForm}
                >
                    <div
                        className="p-1 bg-slate-200 dark:bg-slate-500 hover:text-sky-500 rounded-md"
                    >
                        <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true"
                            className="">
                            <path d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"
                                fill="currentColor"></path>
                        </svg>

                    </div>
                    <span>
                        Clear filter
                    </span>
                </div>
            </div>
        )
    }

    return (
        <>
            <section id="saved-posts-section" className="w-full sm:w-10/12 md:w-3/4 xl:w-3/6 2xl:w-2/5 mx-auto px-2 md:px-0 py-2">

                <div
                    className="w-auto xs:mx-4 my-2 p-1 dark:text-slate-100 border-[#d1d9d1] dark:border-transparent rounded-xl min-h-[45vh]"
                    id="saved-posts-list"
                >
                    <form
                        id="search-saved-form"
                        phx-submit="search_list"
                        className=" my-6"
                        onSubmit={onFormSubmit}
                    >
                        <div className="flex items-center">
                            <div className="flex-1">
                                <input
                                    name='starred-search'
                                    type='text'
                                    aria-describedby="uidnote"
                                    className={'w-full h-10 px-4 py-2 rounded-tl-full rounded-bl-full rounded-tr-none rounded-br-none border border-r-0 border-slate-200 bg-white dark:bg-slate-700 dark:text-slate-100 dark:border-slate-400 outline-none focus:ring-transparent focus:border-gray-400 duration-300'}
                                    onChange={onFormChange}
                                    value={formValue}
                                    placeholder="Search starred posts..."
                                />
                            </div>
                            <button
                                id="search-saved-submit"
                                type="submit"
                                className="pl-3 pr-4 py-3 h-10 text-white bg-sky-500 border-0 rounded-tl-none rounded-bl-none rounded-tr-full rounded-br-full hover:bg-sky-400 duration-300"
                            >
                                <SearchIcon />
                            </button>
                        </div>
                    </form>

                    <h1 id="user-bookmarks-count" className="text-base md:text-xl font-semibold my-6">
                        Saved list {pagePagination.totalPosts}
                    </h1>

                    <div>
                        {userPosts.length && submit ? (renderResultsLine()) : null}

                        {userPosts.map(post => (
                            <StarredPostCard
                                key={post.id}
                                currentUser={currentUser}
                                postData={post}
                            />
                        ))}

                        {isLoading ? (
                            <>
                                {[...Array(4).keys()].map(i => {
                                    return (
                                        <div key={`loading-card-${i}`} className='border dark:border-slate-400 rounded-xl xs:shadow p-3 mb-2'>
                                            <Skeleton classes='title width-50 my-3' />
                                            <Skeleton classes='text width-100 my-1' />
                                        </div>
                                    )
                                })}
                            </>
                        ) : (
                            <>
                                {!userPosts.length && submit ? (renderResultsLine()) : null}
                            </>
                        )
                        }
                    </div>
                </div>

                {pagePagination.hasNextPage ? (
                    <button
                        className={
                            `w-max flex justify-center items-center mx-auto my-4 px-4 py-2 border dark:bg-transparent border-slate-300 dark:border-slate-400 text-slate-600 ease-in-out duration-200 hover:text-slate-800 hover:bg-slate-200 hover:border-slate-200 rounded-full cursor-pointer focus:outline-none `}
                        onClick={loadMorePosts}
                    >
                        Load more
                    </button >
                ) : null}
            </section >
        </>
    )
}

export default StarredList
