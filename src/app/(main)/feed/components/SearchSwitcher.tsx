"use client"

import { mergeUrlParams } from "@/lib/helperFunctions"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

interface SearchSwitcherProps {
    urlOptions: { [x: string]: string | string[] | number | boolean | undefined }
}

function SearchSwitcher({ urlOptions }: SearchSwitcherProps) {

    const [pagination, setPagination] = useState<'classic' | 'infinite'>('classic')
    const initialRender = useRef(true)
    const router = useRouter()

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false
            return
        }
        const urlParams = mergeUrlParams({
            ...urlOptions,
            inf: pagination === 'infinite' ? 'y' : undefined,
            limit: pagination === 'infinite' ? 6 : urlOptions.limit,
            page: pagination === 'infinite' ? 1 : urlOptions.page
        })

        router.push(`/feed?${urlParams}`, { scroll: false })

    }, [pagination])

    return (
        <div className="relative flex min-w-[14rem] m-auto p-1 shadow-article-shadow bg-white dark:bg-slate-600 dark:shadow-none rounded-full">
            <span className="absolute inset-0 m-1 pointer-events-none" aria-hidden="true">
                <span className={`absolute inset-0 w-1/2 bg-indigo-500 rounded-full shadow-sm shadow-indigo-950/10 transform transition-transform duration-150 ease-in-out ${pagination === 'classic' ? 'translate-x-0' : 'translate-x-full'}`}></span>
            </span>
            <button
                className={`relative flex-1 text-sm font-medium h-8 rounded-full focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 dark:focus-visible:ring-slate-600 transition-colors duration-150 ease-in-out ${pagination === 'classic' ? 'text-white' : 'text-slate-500 dark:text-slate-300'}`}
                onClick={() => setPagination('classic')}
            >
                Pagination
            </button>
            <button
                className={`relative flex-1 text-sm font-medium h-8 rounded-full focus-visible:outline-none focus-visible:ring focus-visible:ring-indigo-300 dark:focus-visible:ring-slate-600 transition-colors duration-150 ease-in-out ${pagination === 'classic' ? 'text-slate-500 dark:text-slate-300' : 'text-white'}`}
                onClick={() => setPagination('infinite')}
            >
                Infinite Scroll
            </button>
        </div>
    )
}

export default SearchSwitcher
