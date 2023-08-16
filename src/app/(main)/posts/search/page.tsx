import Image from "next/image"
import Link from "next/link"
import { formatPostDate } from '@/lib/helperFunctions'
import PostTask from "@/lib/posts"
import MyPaginator from "./Paginator"
import { UserAvatar } from "@/components/CoreComponents"
import SearchForm from "./SearchForm"

async function PostPagination({ searchParams }: {
    searchParams: {
        [key: string]: string | string[] | undefined
    }
}) {
    const curPageNum: number = Number(searchParams?.page) || 0
    const curPage: number = curPageNum === 0 ? curPageNum + 1 : curPageNum
    const limit = Number(searchParams?.limit) || 6
    const term = searchParams?.term || undefined

    const minRange: number = (curPage - 1) * limit

    const posts = PostTask.getPaginatedPosts(limit, minRange,
        {
            title: {
                contains: term,
                mode: 'insensitive'
            }
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

    const [pagePosts, totalCount] = await Promise.all([posts, getPostsCount])
    const numOfPages: number = (Math.ceil(totalCount._count.id / limit))

    function randomImageColor() {
        const randomColors =
            ["from-cyan-500 to-blue-500",
                "from-sky-500 to-indigo-500",
                "from-violet-500 to-fuchsia-500",
                "from-purple-500 to-pink-500"]
        return randomColors[Math.floor(Math.random() * randomColors.length)]
    }

    return (
        <section className='md:mx-auto md:w-11/12 xl:w-8/12 2xl:w-2/4 py-24'>
            <div className='w-full'>
                <div className='mb-12 mx-2 flex items-center justify-between gap-x-16'>
                    <SearchForm
                        initValue={term as string}
                        urlOptions={{
                            page: curPage,
                            limit: limit
                        }} />
                </div>

                {pagePosts.length ? (
                    <>
                        <div
                            role='list'
                            className={`grid px-2 grid-cols-1 gap-x-4 gap-y-8 ${pagePosts.length > 1 ? ' sm:grid-cols-2 sm:gap-x-6 md:grid-cols-3 xl:gap-x-8' : 'w-full sm:max-w-[240px] mx-auto'}`}
                        >
                            {pagePosts?.map(post => (
                                <article key={post.id.toString()} className='relative group flex flex-col border-b xs:border-none xs:shadow-article-shadow xs:hover:shadow-article-hover-shadow dark:text-slate-300 dark:shadow-none dark:hover:shadow-none bg-white dark:bg-transparent xs:dark:bg-slate-600 p-2 xs:rounded-xl transition-all'>
                                    <Link href={`/posts/post/${post?.slug}`} className="absolute opacity-0 left-0 w-full h-full">"Link to post"</Link>
                                    <div className='block h-auto aspect-square w-full max-h-[220px] xs:max-h-max overflow-hidden rounded-lg bg-gray-100'>
                                        {post?.photo_url ? (
                                            <Image
                                                src={post.photo_url}
                                                alt='Post Image'
                                                className='object-cover object-center group-hover:opacity-80 w-full h-full'
                                                width={400}
                                                height={400}
                                            />
                                        ) : (
                                            <div className={
                                                `w-full flex justify-center items-center text-center text-white h-full md:my-0 overflow-hidden bg-gradient-to-r ${randomImageColor()}`
                                            }>
                                                {post?.title}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col justify-between h-3/6 p-2">
                                        <div>
                                            <div className="flex items-center">
                                                <p className='block text-sm font-medium text-gray-500 dark:text-slate-300 pr-2'>
                                                    {formatPostDate(post.updatedAt)}
                                                </p>
                                                <hr className="flex-1 dark:border-slate-500" />
                                            </div>
                                            <h4 className='my-2 w-full line-clamp-2 text-lg xs:text-xl font-medium'>{post.title}</h4>
                                        </div>

                                        <div className="flex items-center gap-1 pt-2 py-2 xs:py-0">
                                            <UserAvatar
                                                link={`/user/${post?.author.username}`}
                                                src={post?.author?.avatarUrl as string || ''}
                                                linkClass={"max-w-[32px] max-h-[32px]"}
                                            />

                                            <Link href={`/user/${post.author.username}`} className="font-semibold text-sm truncate">
                                                <span>{post?.author.username as string}</span>
                                            </Link>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                        <div className='my-10 flex items-center justify-center gap-x-6'>
                            <MyPaginator
                                urlOptions={{
                                    page: curPage,
                                    limit: limit
                                }}
                                numOfPages={numOfPages}
                                search={term}
                            />
                        </div>
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