"use client"

import React, { forwardRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { UserAvatar } from '../CoreComponents'
import { formatPostDate, timeAgo } from '@/lib/helperFunctions'
import { ReadTimeIcon } from '../Icons'
import Image from 'next/image'
import { UserPost } from '@/models/Post'

interface PostCardProps {
    postData: UserPost
}

function randomImageColor() {
    const randomColors =
        ["from-cyan-500 to-blue-500",
            "from-sky-500 to-indigo-500",
            "from-violet-500 to-fuchsia-500",
            "from-purple-500 to-pink-500"]
    return randomColors[Math.floor(Math.random() * randomColors.length)]
}

const SmallPostCard = forwardRef<HTMLDivElement, PostCardProps>(({ postData }, ref) => {

    const [randomColor, setRandomColor] = useState('')

    useEffect(() => {
        setRandomColor(randomImageColor())
    }, [])

    return (
        <article
            ref={ref ? ref : null}
            id={`post-${postData?.id}`}
            className="relative group flex flex-col overflow-hidden min-h-[12rem] bg-white xs:border border-gray-200 rounded-xl md:rounded-lg xs:shadow md:flex-row hover:ring-2 hover:border-transparent hover:ring-indigo-300 xs:hover:bg-slate-50 dark:border-gray-700 dark:bg-slate-600/60 dark:hover:bg-gray-700"
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

function FeedArticle({ postData }: PostCardProps) {

    const [randomColor, setRandomColor] = useState('')

    useEffect(() => {
        setRandomColor(randomImageColor())
    }, [])

    return (
        <article key={postData?.id.toString()} className='relative group flex flex-col border-b xs:border-none xs:shadow-article-shadow xs:hover:shadow-article-hover-shadow dark:text-slate-300 dark:shadow-none dark:hover:shadow-none bg-white dark:bg-transparent xs:dark:bg-slate-600 p-2 xs:rounded-xl transition-all'>
            <Link href={`/posts/post/${postData?.slug}`} className="absolute opacity-0 left-0 w-full h-full">"Link to post"</Link>
            <div className='block h-auto aspect-square w-full max-h-[220px] xs:max-h-max overflow-hidden rounded-lg bg-gray-100'>
                {postData?.photo_url ? (
                    <Image
                        src={postData.photo_url}
                        alt='Post Image'
                        className='object-cover object-center group-hover:opacity-80 w-full h-full'
                        width={400}
                        height={400}
                    />
                ) : (
                    <div className={
                        `w-full flex justify-center items-center text-center text-white h-full md:my-0 overflow-hidden bg-gradient-to-r ${randomColor}`
                    }>
                        {postData?.title}
                    </div>
                )}
            </div>
            <div className="flex flex-col justify-between h-3/6 p-2">
                <div>
                    <div className="flex items-center">
                        <p className='block text-sm font-medium text-gray-500 dark:text-slate-300 pr-2'>
                            {formatPostDate(postData?.updatedAt || new Date())}
                        </p>
                        <hr className="flex-1 dark:border-slate-500" />
                    </div>
                    <h4 className='my-2 w-full line-clamp-2 text-lg xs:text-xl font-medium'>{postData?.title}</h4>
                </div>

                <div className="flex items-center gap-1 pt-2 py-2 xs:py-0">
                    <UserAvatar
                        link={`/user/${postData?.author.username}`}
                        src={postData?.author?.avatarUrl as string || ''}
                        linkClass={"max-w-[32px] max-h-[32px]"}
                    />

                    <Link href={`/user/${postData?.author.username}`} className="font-semibold text-sm truncate">
                        <span>{postData?.author.username as string}</span>
                    </Link>
                </div>
            </div>
        </article>
    )
}

export { SmallPostCard, FeedArticle }
