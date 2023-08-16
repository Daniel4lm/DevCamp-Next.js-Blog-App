"use client"

import Link from "next/link"

interface MyPaginatorProps {
    numOfPages: number
    search?: string | string[] | undefined
    urlOptions: {
        page: number
        limit?: number
    },
}

export default function MyPaginator({ numOfPages, urlOptions, search }: MyPaginatorProps) {

    const isBackBtn: boolean = (urlOptions.page >= 2)
    const isForwardBtn: boolean = (urlOptions.page + 1) <= numOfPages

    const links = Array(numOfPages).fill('').map((_el, index) => (
        <Link
            key={`link-${index}`}
            href={{
                pathname: '/posts/search',
                query: {
                    page: index + 1,
                    ...(search ? { term: search } : {}),
                    ...(urlOptions.limit ? { limit: urlOptions.limit } : { limit: 6 })
                }
            }}
        >
            <div
                className={`rounded-lg w-8 h-8 flex justify-center items-center text-sm font-medium ${(index + 1) === urlOptions.page ? 'bg-[#B1B8F8] dark:bg-indigo-500 text-gray-800 font-semibold' : 'bg-indigo-100 dark:bg-indigo-300 text-slate-600'} duration-150 hover:bg-indigo-200 dark:hover:bg-indigo-200 hover:text-gray-800`}
            >
                {(index + 1)}
            </div>
        </Link>
    ))

    return (
        <div className="flex flex-wrap justify-center items-center gap-2">
            <Link
                href={{
                    pathname: '/posts/search',
                    query: {
                        page: urlOptions.page > 1 ? urlOptions.page - 1 : 1,
                        ...(search ? { term: search } : {}),
                        ...(urlOptions.limit ? { limit: urlOptions.limit } : { limit: 6 })
                    }
                }}
                className={`${!isBackBtn && 'pointer-events-none opacity-50'}`}
            >
                <div
                    className={`px-3 py-1 text-sm font-semibold text-gray-800 dark:text-white`}
                >
                    <span>Prev</span>
                </div>
            </Link>
            {links}
            <Link
                href={{
                    pathname: '/posts/search',
                    query: {
                        page: !isForwardBtn ? urlOptions.page : urlOptions.page + 1,
                        ...(search ? { term: search } : {}),
                        ...(urlOptions.limit ? { limit: urlOptions.limit } : { limit: 6 })
                    }
                }}
                className={`${!isForwardBtn && 'pointer-events-none opacity-50'}`}
            >
                <div
                    className={`px-3 py-1 text-sm font-semibold text-gray-800 dark:text-white`}
                >
                    <span>Next</span>
                </div>
            </Link>
        </div>
    )
}