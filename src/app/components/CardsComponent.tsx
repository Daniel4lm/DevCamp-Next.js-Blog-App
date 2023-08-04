"use client"

import { Post, Tag, User } from '@prisma/client'
import React, { forwardRef, useEffect, useState } from 'react'
import { PostComment } from '../models/Comment'
import Link from 'next/link'
import { UserAvatar } from './CoreComponents'
import { formatPostDate, timeAgo } from '@/lib/helperFunctions'
import { HeartIcon, ReadTimeIcon } from './Icons'
import Image from 'next/image'
import { CommentIcon } from './Icons'

// interface UserPostCardPops {
//     postData: (Post & {
//         comments: PostComment[]
//         author: { [x: string]: string | number | null }
//         tags: Tag[]
//     }) | null
// }

interface UserPostCardPops {
    postData: (Post & {
        author: User
        tags: Tag[]
    }) | null
}

const SmallPostCard = forwardRef<HTMLDivElement, UserPostCardPops>(({ postData }, ref) => {

    const [randomColor, setRandomColor] = useState('')

    useEffect(() => {
        setRandomColor(randomImageColor())
    }, [])

    function randomImageColor() {
        const randomColors =
            ["from-cyan-500 to-blue-500",
                "from-sky-500 to-indigo-500",
                "from-violet-500 to-fuchsia-500",
                "from-purple-500 to-pink-500"]
        return randomColors[Math.floor(Math.random() * randomColors.length)]
    }

    return (
        <article
            ref={ref ? ref : null}
            id={`post-${postData?.id}`}
            className="relative group flex flex-col overflow-hidden min-h-[12rem] bg-white xs:border border-gray-200 rounded-xl md:rounded-lg xs:shadow md:flex-row hover:ring-2 hover:border-transparent hover:ring-indigo-300 xs:hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
        >
            <Link href={`/posts/post/${postData?.slug}`} className="absolute opacity-0 left-0 w-full h-full">"Link to post"</Link>
            {postData?.photo_url ? (
                <div className='relative w-full md:w-64 min-h-[16rem] md:min-h-max h-auto  overflow-hidden'>
                    <Image width={600} height={600} className="absolute p-1 md:p-0 object-cover object-center w-full rounded-xl h-full md:rounded-none md:rounded-l-sm" src={postData.photo_url} alt="Post Image" />
                </div>
            ) : (
                <div className={
                    `w-full rounded-lg h-auto md:w-64 md:rounded-none md:rounded-l-l p-1 md:p-0`
                }>
                    <div className={`w-full h-full min-h-[12em] flex justify-center items-center text-center rounded-lg md:rounded-none md:rounded-l-sm text-white bg-gradient-to-r ${randomColor}`}>
                        {postData?.title}
                    </div>
                </div>
            )}
            <div className="flex flex-col justify-between w-full p-4 leading-normal">
                <h5 className="mb-2 font-bold line-clamp-2 text-lg md:text-xl tracking-tight text-gray-800 dark:text-white">
                    {postData?.title}
                </h5>
                <span className="flex items-center gap-2 text-gray-500 dark:text-gray-100 text-xs md:text-sm ">
                    <div className="w-5 text-indigo-400"><ReadTimeIcon /></div>
                    Reading time • {postData?.readTime} min
                </span>
                <div id="post-tags" className="flex flex-wrap my-2 text-xs md:text-sm">
                    {postData?.tags?.map(tag => (
                        <Link className='mr-[0.4em] my-[0.6em] z-10' key={tag.id} href={`/posts/tags/${tag.name}`}>
                            <span className="border rounded-full uppercase font-light dark:text-slate-100 border-gray-300 px-[0.5rem] py-[0.15rem] hover:bg-slate-200 dark:bg-slate-600 dark:border-slate-400 cursor-pointer">
                                {tag.name}
                            </span>
                        </Link>
                    ))}
                </div>
                <div className="flex items-center">
                    <UserAvatar
                        link={`/user/${postData?.author.username}`}
                        src={postData?.author?.avatarUrl || ''}
                        linkClass={"w-8 h-8 md:w-9 md:h-9 z-10"}
                    />

                    <div className="w-full flex flex-1 justify-between flex-wrap items-center ml-2">
                        <Link href={`/user/${postData?.author.username}`} className="font-medium text-sm lg:text-base">
                            {postData?.author.fullName}
                        </Link>
                        <p className="flex gap-1 text-xs md:text-sm font-light">
                            Posted {timeAgo(postData?.createdAt)}
                        </p>
                    </div>
                </div >
            </div>
        </article>
    )
})


const UserPostCard = forwardRef<HTMLDivElement, UserPostCardPops>(({ postData }, ref) => {

    const [randomColor, setRandomColor] = useState('')

    useEffect(() => {
        setRandomColor(randomImageColor())
    }, [])

    function randomImageColor() {
        const randomColors =
            ["from-cyan-500 to-blue-500",
                "from-sky-500 to-indigo-500",
                "from-violet-500 to-fuchsia-500",
                "from-purple-500 to-pink-500"]
        return randomColors[Math.floor(Math.random() * randomColors.length)]
    }

    return (
        <article
            id={`feed-item-${postData?.id}`}
            ref={ref ? ref : null}
            className="relative group p-2 rounded-sm bg-white dark:bg-slate-600 border dark:border-transparent border-gray-250 hover:border-transparent hover:ring-2 hover:ring-indigo-300 hover:dark:ring-slate-400 md:hover:ring-0 md:shadow-card-shadow md:hover:shadow-card-shadow-hover dark:shadow-none hover:dark:shadow-none duration-200 ease-in-out"
        >
            <Link href={`/posts/post/${postData?.slug}`} className="absolute opacity-0 left-0 w-full h-full">
                "Link to post"
            </Link>

            <div className="w-full flex flex-col xs:flex-row xs:justify-around xs:items-center p-2">
                {postData?.photo_url ? (
                    <div className="w-full relative xs:w-1/2 md:w-1/3 h-full my-4 xs:my-0 rounded-lg overflow-hidden">
                        <Image alt='Post Image' src={postData.photo_url} width={400} height={400} className='mx-auto object-contain rounded-lg' />
                    </div>
                ) : (
                    <div className={
                        `w-full flex justify-center items-center text-center text-white xs:w-1/2 md:w-1/3 min-h-[12em] h-auto my-4 md:my-0 rounded-lg overflow-hidden bg-gradient-to-r ${randomColor}`
                    }>
                        {postData?.title}
                    </div>
                )}
                <div className="w-full xs:w-1/2 md:w-2/3 xs:pl-4 xs:pr-2">
                    <h1 className="font-medium line-clamp-3 text-lg md:text-xl lg:text-2xl my-2 group-hover:text-indigo-500">
                        {postData?.title}
                    </h1>
                    <span className="flex items-center gap-2 text-gray-500 dark:text-gray-100 text-xs md:text-sm ">
                        <div className="w-5 text-indigo-400"><ReadTimeIcon /></div>
                        Reading time • {postData?.readTime} min
                    </span>
                    <div className="flex items-center py-4">
                        <UserAvatar
                            link={`/user/${postData?.author.username}`}
                            src={postData?.author?.avatarUrl || ''}
                            linkClass={"w-8 h-8 md:w-9 md:h-9 z-50"}
                        />

                        <div className="w-full flex justify-between flex-wrap items-center ml-4 z-[4]">
                            <Link href={"/user/#{@post.user.username}"} className="font-medium text-sm lg:text-base">
                                {postData?.author.fullName}
                            </Link>
                            <p className="flex gap-1 text-xs md:text-sm font-light">
                                Posted {timeAgo(postData?.createdAt)}
                            </p>
                        </div>
                    </div >
                </div>

            </div>
            <div className="flex justify-between mt-2 dark:text-slate-300">
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 px-2 py-1 text-xs md:text-sm rounded-full hover:bg-gray-250 dark:hover:bg-slate-400 hover:cursor-pointer z-[1]">
                        <div className="sm:w-6"><HeartIcon /></div>
                        <div className="hidden sm:block"><span>{postData?.totalLikes}</span> Likes</div>
                        <div className="block sm:hidden"><span>{postData?.totalLikes}</span></div>
                    </div>

                    <Link href={`/posts/post/${postData?.slug}#post-comments-section`} className="z-[1]">
                        <div className="flex items-center gap-1 px-2 py-1 text-xs md:text-sm rounded-full hover:bg-gray-250 dark:hover:bg-slate-400 hover:cursor-pointer">
                            <div className="sm:w-6"><CommentIcon /></div>
                            <div className="hidden sm:block">
                                <span>{postData?.totalComments}</span> Comments
                            </div>
                            <div className="block sm:hidden"><span>{postData?.totalComments}</span></div>
                        </div>
                    </Link>
                </div>
                <div className="flex items-center text-[0.9em]">
                    {/* {<div className="flex items-center flex-wrap p-2">
                        <div
                        :for={% { user: user } < - Comments.get_users_from_comments(@post.comment)}
                        id="user-hover-item"
                        className="relative hover-item w-max flex items-center first:mx-0 -ml-2"
                        phx-hook="ToolTip"
                        >
                        <CoreComponents.user_avatar
                            with_link={~p"/user/#{user.username}"}
                        src={FileHandler.get_avatar_thumb(user.avatar_url)}
                        className="w-6 h-6 md:w-8 md:h-8"
                        />

                        <span className="top-tooltip-text px-2 py-2 rounded-md bg-gray-800 opacity-80 text-white text-sm ">
                            <%= user.username %>
                        </span>
                    </div>} */}
                </div>
            </div >
        </article >
    )
})

export { SmallPostCard, UserPostCard }
