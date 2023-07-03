"use client"

import React, { useEffect } from 'react'
import Link from 'next/link'
import { UserAvatar } from '@/app/components/CoreComponents'
import { formatPostDate } from '@/lib/helperFunctions'
import { Tag, User, Post, Prisma } from '@prisma/client'
import Image from 'next/image'
import { ChatIcon, EmptyHeartIcon, PostTagIcon } from '@/app/components/Icons'
import PostComments from './PostComments'
import ScrollToTopButton from './ScrollToTop'
import PostSidebar from './PostSidebar'
import { PostComment } from '@/app/models/Comment'

import hljs from 'highlight.js/lib/common'
import 'highlight.js/styles/github-dark.css'
import { usePostQuery } from '@/app/hooks/api'
hljs.configure({
    languages: ['javascript', 'java', 'css', 'php', 'go'],
    cssSelector: '#post-body pre'
})

interface PostBodyProps {
    postData: (Post & {
        comments: PostComment[]
        author: { [x: string]: string | number | null }
        tags: Tag[]
    }) | null
}

const PostBody = ({ postSlug }: { postSlug: string }) => {

    const { data: post, isLoading } = usePostQuery(postSlug)

    useEffect(() => {
        // document.querySelectorAll('#post-body pre').forEach((el) => {
        //     hljs.highlightElement(el as HTMLPreElement)
        // })
        hljs.highlightAll()
    }, [])

    return (
        <>
            <ScrollToTopButton />
            <PostSidebar data={post} />

            <div id="post-wrapper" className="w-full overflow-y-auto bg-white dark:bg-navbar-dark dark:text-slate-100 border-t border-b sm:border border-[#d1d9d1] dark:border-0 mb-14 py-6">
                <article
                    id="user-post"
                    className="flex flex-col"
                >
                    <header className="mx-4 sm:mx-12 my-2">
                        <h1 className="font-bold text-xl text-center lg:text-3xl my-4">{post?.title}</h1>
                        <div id="post-tags" className="flex flex-wrap justify-center my-2 text-xs md:text-sm">
                            {post?.tags?.map(tag => (
                                <Link className='mx-[0.2em] my-[0.6em]' key={tag.id} href={`/posts/tags/${tag.name}`}>
                                    <span className="border rounded-full dark:text-slate-700 border-gray-300 px-3 py-1 hover:bg-gray-100 dark:bg-slate-400 dark:border-slate-400 cursor-pointer z-[1]">
                                        #{tag.name}
                                    </span>
                                </Link>
                            ))}
                        </div>

                        <p className="w-max mx-auto flex text-sm mt-8 gap-1">
                            Last Updated on
                            <time
                                dateTime={new Date(post!.updatedAt).toISOString()}
                                className="font-semibold"
                                title={formatPostDate(post!.updatedAt)}
                            >
                                {formatPostDate(post!.updatedAt)}
                            </time>
                        </p>

                        <div className="flex items-center mt-4">
                            <div className="flex items-center flex-1">
                                <UserAvatar
                                    link={`/user/${post?.author.username}`}
                                    src={post?.author?.avatarUrl as string || ''}
                                    linkClass={"w-8 h-8 md:w-10 md:h-10"}
                                />
                                <div className="flex-1 ml-4">
                                    <Link href={`/user/${post?.author.username}`} className="font-bold text-sm md:text-base">
                                        {post?.author.fullName}
                                    </Link>
                                    <p className="flex text-sm gap-1">
                                        <span className='hidden xs:block'>Posted on</span>
                                        <time
                                            dateTime={new Date(post?.createdAt || '').toISOString()}
                                            className="date-no-year"
                                            title={formatPostDate(post!.createdAt)}
                                        >
                                            {formatPostDate(post!.createdAt)}
                                        </time>
                                    </p>
                                </div>
                            </div>
                            <span className="hidden xs:block text-gray-600 pt-2 dark:text-gray-100 text-sm md:text-base">
                                Reading time • {post?.readTime} min
                            </span>
                            <span className="xs:hidden text-gray-600 pt-2 dark:text-gray-100 text-sm">
                                Read • {post?.readTime} min
                            </span>
                        </div>

                    </header >

                    <hr className="mx-4 sm:mx-12 my-4 dark:border-slate-500" />

                    {post?.photo_url && (
                        <div className="max-w-[44rem] 2xl:max-w-3xl mx-auto px-4 sm:px-12 xl:px-0 my-8 rounded-lg overflow-hidden">
                            <Image
                                alt='Blog Photo'
                                src={post?.photo_url}
                                width={800}
                                height={450}
                                loading="eager"
                                style={{
                                    objectFit: 'contain',
                                    borderRadius: '0.5rem',
                                    width: '100%',
                                    height: 'auto',
                                }}
                            />
                        </div>
                    )}

                    <div
                        id="post-body"
                        className="mx-4 sm:mx-12 py-4 text-sm md:text-base text-justify"
                    >
                        <div dangerouslySetInnerHTML={{ __html: post!.body }} />
                    </div>

                    <hr className="my-1 dark:border-slate-500" />

                    <div className="w-full">
                        <div className="w-max mx-auto flex items-center pl-4 pr-2 py-4 text-gray-500 dark:text-slate-200">
                            <div className="flex items-center">
                                <EmptyHeartIcon />
                                <span className="px-2 text-sm md:text-base font-bold focus:outline-none">
                                    {post?.totalLikes} likes
                                </span>
                            </div>
                            <div className="flex items-center ml-4">
                                <ChatIcon />
                                <span className="px-2 text-sm md:text-base font-bold focus:outline-none">
                                    {post?.totalComments} comments
                                </span>
                            </div>
                            <div className="flex items-center ml-4">
                                <PostTagIcon />
                                {/* post tag placeholder */}
                            </div>
                        </div>
                    </div>
                </article>
                <div>
                    {post?.author.email ?
                        <PostComments
                            postComments={post.comments}
                            data={{ postId: post.id, authorId: post.authorId, postSlug: post.slug }}
                        />
                        :
                        (<div id="post-comments-section" className="p-4 flex justify-center items-center mt-3 border-t-2 border-gray-100 text-sm md:text-base">
                            <Link
                                href={"/auth/login"}
                                className="text-indigo-500 dark:text-indigo-300 px-4 py-1 border border-indigo-400 dark:border-indigo-300 rounded-full"
                            >
                                Log in to comment
                            </Link>
                        </div>)
                    }
                </div>
            </div>
        </>
    )
}

export default PostBody