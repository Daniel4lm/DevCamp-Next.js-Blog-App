import PostTask from "@/lib/posts"
import MyPaginator from "./components/Paginator"
import SearchForm from "./SearchForm"
import { FeedArticle } from "@/components/posts-comments/CardsComponent"
import { UserPost } from "@/models/Post"
import SearchSwitcher from "./components/SearchSwitcher"
import UserTask from "@/lib/user"
import { User } from "@/models/User"
import ArticlesList from "./components/ArticlesList"

async function PostPagination({ searchParams }: {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}) {
    const curPageNum: number = Number(searchParams?.page) || 0
    const curPage: number = curPageNum === 0 ? curPageNum + 1 : curPageNum
    const limit = Number(searchParams?.limit) || 6
    const term = searchParams?.term || undefined
    const isInfinite = searchParams?.inf && searchParams?.inf === 'y' ? searchParams?.inf : undefined

    const minRange: number = (curPage - 1) * limit

    const posts = PostTask.getPaginatedPosts(limit, minRange,
        {
            OR: [
                {
                    title: {
                        contains: term,
                        mode: 'insensitive'
                    }
                },
                {
                    tags: {
                        some: {
                            name: {
                                contains: term,
                                mode: 'insensitive'
                            }
                        }
                    }
                }
            ]
        }
    )

    const getPostsCount = PostTask.getNumOfRecords(
        {
            title: {
                contains: term,
                mode: 'insensitive'
            }
        }
    )

    const users = UserTask.getUsers({
        OR: [{
            username: {
                contains: term,
                mode: 'insensitive'
            }
        },
        {
            fullName: {
                contains: term,
                mode: 'insensitive'
            }
        }]
    })

    const [pagePosts, totalCount, foundUsers] = await Promise.all([posts, getPostsCount, users])
    const numOfPages: number = Math.ceil(totalCount._count.id / limit)

    return (
        <section className='md:mx-auto md:w-11/12 xl:w-8/12 2xl:w-2/4 py-24'>
            <div className='w-full'>

                <div className='mb-12 mx-2 md:mx-4 flex flex-col md:flex-row items-center justify-between gap-y-4 md:gap-x-10'>
                    <div className="w-full">
                        <SearchForm
                            initValue={term as string}
                            urlOptions={{
                                page: curPage,
                                limit: limit,
                                inf: isInfinite
                            }}
                            searchResults={foundUsers as User[]}
                        />
                    </div>

                    <div className="">
                        <SearchSwitcher
                            urlOptions={{
                                page: curPage,
                                limit: limit,
                                term: term
                            }}
                        />
                    </div>
                </div>

                {pagePosts.length ? (
                    <>
                        {isInfinite === 'y' ? (
                            <div>
                                <ArticlesList
                                    urlOptions={{
                                        page: curPage,
                                        limit: limit,
                                        term: term,
                                        inf: isInfinite
                                    }}
                                    hasNexPage={curPage < numOfPages}
                                    initialArticles={pagePosts as UserPost[]}
                                />

                            </div>
                        ) : (
                            <div>
                                <div
                                    role='list'
                                    className={`grid px-2 grid-cols-1 gap-x-4 gap-y-8 ${pagePosts.length > 1 ? ' sm:grid-cols-2 sm:gap-x-6 md:grid-cols-3 xl:gap-x-8' : 'w-full sm:max-w-[240px] mx-auto'}`}
                                >
                                    {pagePosts?.map(post => (
                                        <FeedArticle key={post.id} postData={post as UserPost} />
                                    ))}
                                </div>
                                <div className='my-10 flex flex-col items-center justify-center gap-y-4'>
                                    <hr className="w-full dark:border-gray-600" />
                                    {numOfPages > 1 ? (
                                        <MyPaginator
                                            urlOptions={{
                                                page: curPage,
                                                limit: limit
                                            }}
                                            numOfPages={numOfPages}
                                            search={term}
                                        />
                                    ) : null}
                                </div>
                            </div>
                        )}
                    </>
                )
                    : (
                        <div className="relative w-full md:w-2/3 xl:w-full mb-4 space-y-2 min-h-[22vh] rounded-lg bg-white dark:bg-slate-600 border dark:border-transparent border-gray-200">
                            <span className="absolute font-medium md:text-lg text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                Empty list or no results match this query!
                            </span>
                        </div>
                    )}
            </div>
        </section>
    )
}

export default PostPagination