"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import { CloseIcon } from '@/components/Icons'
import { User } from '@/models/User'
import { AvatarLink } from '@/components/CoreComponents'
import useOutsideClick from '@/hooks/useOutsideClick'
import { mergeUrlParams } from '@/lib/helperFunctions'

export default function SearchForm({ initValue, searchResults, urlOptions }: {
    initValue?: string,
    urlOptions: { [x: string]: string | number | boolean | undefined },
    searchResults: User[]
}) {
    const [value, setValue] = useState(initValue || '')
    const [openList, setOpenList] = useState(false)
    const router = useRouter()
    const initialRender = useRef(true)
    const listRef = useRef(null)

    useOutsideClick(listRef, closeMenu)

    function closeMenu() {
        setOpenList(false)
    }

    function maybeOpenList(value: string) {
        if (!value) return
        setOpenList(true)
    }

    function clearForm() {
        setValue('')
        setOpenList(false)
        navigateOnFormClear('')
    }

    function onFormSubmit(event: FormEvent) {
        event.preventDefault()

        console.info('submit form...')

        if (value === '') {
            // clear list of items
            return
        }
    }

    function navigateOnFormClear(value: string) {

        if (value.length === 0) {
            const urlParams = mergeUrlParams({
                ...urlOptions,
                limit: urlOptions?.inf === 'y' ? undefined : urlOptions?.limit,
                page: urlOptions?.inf === 'y' ? 1 : urlOptions?.page,
                term: '',
            })

            setTimeout(() => {
                router.push(`/feed?${urlParams}`)
            }, 1000)
        }
    }

    const onFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget
        setValue(value)
        navigateOnFormClear(value)
    }

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false
            return
        }
        let timer: ReturnType<typeof setTimeout>

        if (value && value.length > 0) {
            const urlParams = mergeUrlParams({
                ...urlOptions,
                page: 1,
                term: value,
            })
            timer = setTimeout(() => {
                router.push(`/feed?${urlParams}`)
            }, 1000)
        }
        return () => { clearTimeout(timer) }

    }, [value])

    return (
        <div
            ref={openList ? listRef : null}
            className="relative flex w-full sm:w-auto"
        >
            <form
                id="navbar-search-form"
                className="w-full"
                onSubmit={onFormSubmit}
            >
                <div className="relative">
                    <input
                        id="posts-search-input"
                        name="search_term"
                        type="search"
                        placeholder="Search posts or users"
                        autoComplete='off'
                        value={value}
                        onChange={onFormChange}
                        onClick={() => maybeOpenList(value || '')}
                        className="rounded-full w-full border transition-all duration-150 dark:bg-slate-600 bg-search-icon dark:bg-search-icon-dark bg-no-repeat bg-[length:20px] bg-[right_0.8em_center] ring-0 border-gray-400 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-blue-400 focus:ring-opacity-90 focus:border-transparent dark:text-gray-200 pr-[2.4em] pl-[0.8em] py-[0.4em] text-base placeholder:font-light placeholder:text-slate-400 dark:placeholder:text-slate-300"
                    />
                    <div
                        id="clear-form-btn"
                        className={`${value && (value).length > 0 ? "block" : "hidden"} absolute text-gray-600 dark:text-slate-200 top-1/2 right-10 -translate-y-1/2 transition scale-80 p-1 rounded-lg hover:bg-slate-200 hover:dark:bg-slate-400`}
                        onClick={clearForm}
                    >
                        <CloseIcon />
                    </div>
                </div>
            </form>

            {openList ? (
                <ul
                    id="post-search-list"
                    className={
                        `absolute z-50 top-[110%] left-0 w-full border bg-white dark:bg-slate-600 dark:text-slate-100 border-slate-300 dark:border-slate-500 rounded-lg overflow-hidden shadow-lg ${searchResults.length > 0 ? "h-auto" : "h-40"} #{@overflow_y_scroll_ul}`
                    }
                >
                    {searchResults.length ? (
                        <>
                            <p className="p-2 text-sm">Found users</p>
                            <hr />
                            {searchResults.map(user => (
                                <Link key={user.id} href={`/user/${user.username}`}>
                                    <li className="flex items-center rounded-md m-1 px-2 py-3 hover:bg-indigo-50 dark:hover:bg-slate-400 dark:hover:bg-opacity-50">

                                        <AvatarLink
                                            src={user.avatarUrl || ''}
                                            className="w-7 h-7 md:w-8 md:h-8 border"
                                        />

                                        <div className="ml-3">
                                            <h2 className="font-bold text-sm">
                                                {user.username}
                                            </h2>
                                            <h3 className="text-sm ">{user.fullName}</h3>
                                        </div>
                                    </li>
                                </Link>
                            ))}
                        </>
                    ) : (
                        <li className="text-sm text-gray-400 dark:text-gray-200 flex justify-center items-center h-full">
                            No results found.
                        </li>
                    )}
                </ul>
            ) : null}
        </div >
    )
}

