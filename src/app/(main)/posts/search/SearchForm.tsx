"use client"

import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
//import Link from 'next/link'
import { CloseIcon } from '@/components/Icons'
import { useRouter } from 'next/navigation'

function mergeUrlParams(options: {}) {
    return Object.keys(options)
        .filter(field => !!options[field as keyof {}])
        .reduce((acc, field, index) => {
            const divider = index > 0 ? '&' : ''
            return `${acc}${divider}${field}=${options[field as keyof {}]}`
        }
            , "")
}

export default function SearchForm({ initValue, urlOptions }: {
    initValue?: string,
    urlOptions: {
        page: number
        limit?: number
    },
}) {
    const [value, setValue] = useState(initValue || '')
    const router = useRouter()
    const initialRender = useRef(true)

    function maybeOpenList(value: string) {
        if (value) return
        // open dropdown list
    }

    function clearForm() {
        setValue('')
    }

    function onFormSubmit(event: FormEvent) {
        event.preventDefault()

        console.info('submit form...')

        if (value === '') {
            // clear list of items
            return
        }
    }

    const onFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.currentTarget
        setValue(value)
    }

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false
            return
        } else {
            let timer: ReturnType<typeof setTimeout>
            const urlParams = mergeUrlParams({
                term: value,
                ...urlOptions
            })

            if (value && value.length > 0) {
                timer = setTimeout(() => {
                    router.push(`/posts/search?${urlParams}`)
                }, 1000)
            } else {
                timer = setTimeout(() => {
                    router.push(`/posts/search?${urlParams}`)
                }, 400)
            }
            return () => { clearTimeout(timer) }
        }
    }, [value, urlOptions, router])

    return (
        <div className="relative flex w-full sm:w-auto md:w-2/5">
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
                        className="rounded-full w-full border transition-all duration-150 dark:bg-slate-500 bg-search-icon dark:bg-search-icon-dark bg-no-repeat bg-[length:20px] bg-[right_0.8em_center] ring-0 border-gray-400 focus:ring-2 focus:ring-indigo-400 dark:focus:ring-blue-400 focus:ring-opacity-90 focus:border-transparent dark:text-gray-200 pr-[2.4em] pl-[0.8em] py-[0.4em] text-base placeholder:font-light placeholder:text-slate-400 dark:placeholder:text-slate-300"
                    />
                    <div
                        id="clear-form-btn"
                        className={`${value && (value).length > 0 ? "block" : "hidden"} absolute opacity-0 text-gray-500 dark:text-slate-200 top-1/2 right-10 -translate-y-1/2 transition scale-80 p-1 rounded-full hover:bg-neutral-200 hover:dark:bg-slate-400`}
                        onClick={clearForm}
                    >
                        <CloseIcon />
                    </div>
                </div>
            </form>

            {/* {<ul
            : if={@while_searching ?}
            id="post-search-list"
            phx-click-away={close_search_list(@myself)}
            phx-window-keydown={close_search_list(@myself)}
            phx-key="escape"
            phx-target={@myself}
            className={
                "absolute top-[110%] left-0 w-full border bg-white dark:bg-slate-500 dark:text-slate-100 border-slate-400 dark:border-0 rounded-lg overflow-hidden shadow-sm #{if(@results_not_found?, do: "h-40", else: "h - 96")} #{@overflow_y_scroll_ul}"
            }
            >
                <%= unless Enum.empty ? (@searched_posts) do %>
                <p className="p-2 text-sm">Posts:</p>
                <Link :for={post <- @searched_posts} navigate={~p"/post/#{post.slug}"}>
                <li className="flex items-center rounded-md m-1 px-2 py-3 hover:bg-indigo-50 dark:hover:bg-slate-400 dark:hover:bg-opacity-50">
                    <%= if post.photo_url do %>
                    <%= img_tag(post.photo_url,
                    className: "w-10 h-10 rounded-md object-cover object-center"
                            ) %>
                    <% end %>
                    <div className="ml-3">
                        <h2 className="font-bold text-sm ">
                            <%= post.title %>
                        </h2>
                        <h3 className="text-sm "><%= post.user.full_name %></h3>
                    </div>
                </li>
                </Link >
                <% end %>
                <hr />
                <%= unless Enum.empty?(@searched_users) do %>
                <p className="p-2 text-sm">Users:</p>
                <Link :for={user <- @searched_users} navigate={~p"/user/#{user.username}"}>
                <li className="flex items-center rounded-md m-1 px-2 py-3 hover:bg-indigo-50 dark:hover:bg-slate-400 dark:hover:bg-opacity-50">
                    <.user_avatar src={user.avatar_url} className="w-10 h-10 " />

                    <div className="ml-3">
                        <h2 className="font-bold text-sm ">
                            <%= user.username %>
                        </h2>
                        <h3 className="text-sm "><%= user.full_name %></h3>
                    </div>
                </li>
                </Link >
                <% end %>

                <li
                    : if={@results_not_found ?}
                    class="text-sm text-gray-400 dark:text-gray-200 flex justify-center items-center h-full"
                >
                    No results found.
                </li>
            </ul >
        </div >} 
        */}
        </div>
    )
}

