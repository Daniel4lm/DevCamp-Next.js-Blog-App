import PostTask from "@/lib/posts"
import MyPaginator from "./components/Paginator"
import SearchForm from "./components/SearchForm"
import SearchSwitcher from "./components/SearchSwitcher"
import InfiniteList from "./components/InfiniteList"
import { Suspense } from "react"
import Await from "@/components/Await"
import PaginationSkeleton from "@/components/skeletons/pagination"
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
                        //searchResults={foundUsers as User[]}
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

                <Suspense fallback={<PaginationSkeleton />} key={Math.random()}>
                    <Await promise={posts}>
                        {({ posts, count }) => {
                            const numOfPages: number = Math.ceil(count.id / limit)
                            return (
                                <div>
                                    {
                                        posts.length ? (
                                            <>
                                                {isInfinite === 'y' ? (
                                                    <div>
                                                        <InfiniteList
                                                            urlOptions={{
                                                                page: curPage,
                                                                limit: limit,
                                                                term: term,
                                                                inf: isInfinite
                                                            }}
                                                            hasNexPage={curPage < numOfPages}
                                                            initialArticles={posts}
                                                        />

                                                    </div>
                                                ) : (
                                                    <div>
                                                        <div
                                                            role='list'
                                                            className={`grid px-2 grid-cols-1 gap-x-4 gap-y-8 ${posts.length > 1 ? ' sm:grid-cols-2 sm:gap-x-6 md:grid-cols-3 xl:gap-x-8' : 'w-full sm:max-w-[240px] mx-auto'}`}
                                                        >
                                                            <ArticlesList articles={posts} />
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
                                                <div className="relative w-auto card-item flex flex-col items-center justify-center gap-4 mx-2 md:mx-4 mb-4 space-y-2 min-h-[22vh] rounded-xl bg-white dark:bg-slate-600 border dark:border-transparent border-slate-50">
                                                    <div>
                                                        <svg width="167" height="90" viewBox="0 0 167 90" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <g clipPath="url(#clip0_1928_27)">
                                                                <path className="fill-[#F3F7FF] dark:fill-transparent" fillRule="evenodd" clipRule="evenodd" d="M129 82H46C42.134 82 39 78.866 39 75C39 71.134 42.134 68 46 68H7C3.13401 68 0 64.866 0 61C0 57.134 3.13401 54 7 54H47C50.866 54 54 50.866 54 47C54 43.134 50.866 40 47 40H22C18.134 40 15 36.866 15 33C15 29.134 18.134 26 22 26H62C58.134 26 55 22.866 55 19C55 15.134 58.134 12 62 12H160C163.866 12 167 15.134 167 19C167 22.866 163.866 26 160 26H120C123.866 26 127 29.134 127 33C127 36.866 123.866 40 120 40H142C145.866 40 149 43.134 149 47C149 50.866 145.866 54 142 54H131.826C126.952 54 123 57.134 123 61C123 63.5773 125 65.9107 129 68C132.866 68 136 71.134 136 75C136 78.866 132.866 82 129 82ZM160 54C156.134 54 153 50.866 153 47C153 43.134 156.134 40 160 40C163.866 40 167 43.134 167 47C167 50.866 163.866 54 160 54Z"

                                                                />
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M71.1186 60.3066C71.0404 60.8599 71 61.4252 71 62C71 68.6274 76.3726 74 83 74C89.6274 74 95 68.6274 95 62C95 61.4252 94.9596 60.8599 94.8815 60.3066H124V87C124 88.6569 122.657 90 121 90H45C43.3431 90 42 88.6569 42 87V60.3066H71.1186Z" fill="none" />
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M96 60C96 67.1797 90.1797 73 83 73C75.8203 73 70 67.1797 70 60C70 59.7674 70.0061 59.5362 70.0182 59.3066H42L51.5604 31.0389C51.9726 29.8202 53.1159 29 54.4023 29H111.598C112.884 29 114.027 29.8202 114.44 31.0389L124 59.3066H95.9818C95.9939 59.5362 96 59.7674 96 60Z" fill="none" />
                                                                <path className="fill-[#E8F0FE] dark:fill-transparent" fillRule="evenodd" clipRule="evenodd" d="M94.0976 60.9545C94.0976 66.5025 89.129 72 83 72C76.871 72 71.9024 66.5025 71.9024 60.9545C71.9024 60.7748 71.9077 59.5962 71.918 59.4188H51L59.1614 39.5755C59.5132 38.6338 60.4891 38 61.5873 38H104.413C105.511 38 106.487 38.6338 106.839 39.5755L115 59.4188H94.082C94.0923 59.5962 94.0976 60.7748 94.0976 60.9545Z"
                                                                    fill="#E8F0FE"
                                                                />
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M43.25 59.5123V86C43.25 86.9665 44.0335 87.75 45 87.75H121C121.966 87.75 122.75 86.9665 122.75 86V59.5123L113.255 31.4393C113.015 30.7285 112.348 30.25 111.598 30.25H54.4023C53.6519 30.25 52.985 30.7285 52.7446 31.4393L43.25 59.5123Z" stroke="#75A4FE" strokeWidth="2.5" />
                                                                <path d="M48.5737 59H51M56 59C59.9366 59 64.1849 59 68.7449 59C70.6212 59 70.6212 60.3186 70.6212 61C70.6212 67.6274 76.1174 73 82.8973 73C89.6772 73 95.1734 67.6274 95.1734 61C95.1734 60.3186 95.1734 59 97.0496 59H122" stroke="#75A4FE" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                <path d="M81.3267 19.0455V18.9006C81.3428 17.3632 81.5038 16.1397 81.8097 15.2301C82.1155 14.3205 82.5502 13.584 83.1136 13.0206C83.6771 12.4571 84.3532 11.938 85.142 11.4631C85.617 11.1733 86.0436 10.8312 86.4219 10.4368C86.8002 10.0343 87.098 9.5715 87.3153 9.04829C87.5407 8.52509 87.6534 7.94555 87.6534 7.30966C87.6534 6.52083 87.4683 5.83665 87.098 5.2571C86.7277 4.67756 86.2327 4.23082 85.6129 3.9169C84.9931 3.60298 84.3049 3.44602 83.5483 3.44602C82.8883 3.44602 82.2524 3.58286 81.6406 3.85653C81.0289 4.13021 80.5178 4.56084 80.1072 5.14844C79.6967 5.73603 79.4593 6.50473 79.3949 7.45454H76.3523C76.4167 6.08617 76.7708 4.91501 77.4148 3.94105C78.0668 2.96709 78.924 2.22254 79.9865 1.70738C81.0571 1.19223 82.2443 0.934658 83.5483 0.934658C84.965 0.934658 86.1965 1.21638 87.2429 1.77983C88.2973 2.34328 89.1103 3.116 89.6818 4.09801C90.2614 5.08002 90.5511 6.19886 90.5511 7.45454C90.5511 8.33996 90.4143 9.14086 90.1406 9.85724C89.875 10.5736 89.4886 11.2135 88.9815 11.777C88.4825 12.3404 87.8788 12.8395 87.1705 13.2741C86.4621 13.7169 85.8947 14.1837 85.468 14.6747C85.0414 15.1577 84.7315 15.7332 84.5384 16.4013C84.3452 17.0694 84.2405 17.9025 84.2244 18.9006V19.0455H81.3267ZM82.8722 26.1932C82.2765 26.1932 81.7654 25.9799 81.3388 25.5533C80.9122 25.1267 80.6989 24.6155 80.6989 24.0199C80.6989 23.4242 80.9122 22.9131 81.3388 22.4865C81.7654 22.0599 82.2765 21.8466 82.8722 21.8466C83.4678 21.8466 83.9789 22.0599 84.4055 22.4865C84.8322 22.9131 85.0455 23.4242 85.0455 24.0199C85.0455 24.4143 84.9448 24.7765 84.7436 25.1065C84.5504 25.4366 84.2888 25.7022 83.9588 25.9034C83.6368 26.0966 83.2746 26.1932 82.8722 26.1932Z"
                                                                    fill="#75A4FE"
                                                                />
                                                            </g>
                                                            <defs>
                                                                <clipPath id="clip0_1928_27">
                                                                    <rect width="167" height="90" fill="none" />
                                                                </clipPath>
                                                            </defs>
                                                        </svg>

                                                    </div>
                                                    <span className=" font-medium md:text-lg text-center">
                                                        Empty list or no results match this query!
                                                    </span>
                                                </div>
                                            )
                                    }
                                </div>
                            )
                        }}
                    </Await>
                </Suspense>
            </div >
        </section >
    )
}

export default PostPagination