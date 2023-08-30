"use client"

import React, { useEffect, useRef } from 'react'
import { usePostQuery } from '@/hooks/api'
import { User as SessionUser } from "next-auth"
import 'highlight.js/styles/github-dark.css'
import Image from 'next/image'
import Link from 'next/link'
import hljs from 'highlight.js/lib/common'
import { UserAvatar } from '@/components/CoreComponents'
import { formatPostDate } from '@/lib/helperFunctions'
import { ChatIcon, DownloadIcon, EmptyHeartIcon, PostTagIcon } from '@/components/Icons'
import PostComments from './PostComments'
import ScrollToTopButton from './ScrollToTop'
import PostSidebar from './PostSidebar'
import ToolTip from '@/components/Tooltip'

hljs.configure({
    languages: ['javascript', 'java', 'css', 'php', 'go'],
    cssSelector: '#post-body pre'
})

const PostBody = ({ postSlug, currentUser }: { postSlug: string, currentUser: SessionUser | undefined }) => {

    const { data: post } = usePostQuery(postSlug)
    const effectRun = useRef(false)
    const postImageName = (post?.photo_url || '').split('/').at(-1)

    useEffect(() => {
        // document.querySelectorAll('#post-body pre').forEach((el) => {
        //     hljs.highlightElement(el as HTMLPreElement)
        // })

        if (effectRun.current === true) {
            hljs.highlightAll()

            let codeBlocks: NodeListOf<HTMLPreElement> = document.querySelectorAll('#post-body pre')

            codeBlocks.forEach((block) => {
                if (navigator.clipboard) {
                    let copyButton = document.createElement('button')
                    copyButton.innerText = 'Copy'
                    copyButton.classList.add(
                        'rounded-full', '!font-inter', 'hidden', 'absolute', 'top-1', 'right-1', 'px-2', 'py-1',
                        'hover:bg-slate-600', 'hover:text-green-400'
                    )
                    block.appendChild(copyButton)

                    block.addEventListener("mouseover", () => copyButton.classList.replace('hidden', 'block'))
                    block.addEventListener("mouseout", () => copyButton.classList.replace('block', 'hidden'))

                    copyButton.addEventListener("click", async () => {
                        copyButton.innerText = "Copied"
                        copyButton.classList.add('text-green-500')
                        await copyCode(block)
                        setTimeout(() => { copyButton.innerText = "Copy" }, 4000)
                    })
                }
            })
        }

        async function copyCode(block: HTMLPreElement) {
            let code = block.innerText

            try {
                await navigator.clipboard.writeText(code)
            } catch (err) {
                console.error('Failed to copy code: ', err)
            }
        }

        return () => {
            effectRun.current = true
        }
    }, [])

    return (
        <>
            <ScrollToTopButton />
            <PostSidebar data={post} currentUser={currentUser} />

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
                    </header>

                    <hr className="mx-4 sm:mx-12 my-4 dark:border-slate-500" />

                    {post?.photo_url ? (
                        <div id='blog-image-container' className="relative max-w-[44rem] 2xl:max-w-3xl mx-4 sm:mx-12 xl:mx-auto my-8 rounded-lg">
                            <a
                                id='download-icon'
                                href={`/api/download/${postImageName}`}
                                target='_blank'
                                rel='noreferrer'
                                className='invisible absolute top-2 right-2 border-2 rounded-full bg-white opacity-60 hover:bg-indigo-600 text-[#5e5e5e] hover:text-white border-[#313131] cursor-pointer hover:border-indigo-200'
                            >
                                <ToolTip position="left" title="Download image">
                                    <div className='p-2'>
                                        <DownloadIcon />
                                    </div>
                                </ToolTip>
                            </a>
                            <Image
                                alt='Blog Photo'
                                src={post?.photo_url}
                                width={800}
                                height={850}
                                sizes="(min-width: 2460px) 768px, 
                                (min-width: 1240px) 704px, (min-width: 1040px) calc(51.11vw + 80px), 
                                (min-width: 980px) 704px, 
                                (min-width: 640px) 
                                calc(88.75vw - 148px), 
                                calc(100vw - 32px)"
                                priority={true}
                                style={{
                                    objectFit: 'contain',
                                    borderRadius: '0.5rem',
                                    width: '100%',
                                    height: 'auto',
                                }}
                                className='mx-auto'
                            />
                        </div>
                    ) : null}

                    <div
                        id="post-body"
                        className="mx-4 sm:mx-12 py-4 text-sm md:text-base text-justify"
                    >
                        <div dangerouslySetInnerHTML={{ __html: post?.body || '' }} />
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
                                <span className="px-2 text-sm md:text-base font-bold focus:outline-none">
                                    {post?.totalBookmarks}
                                </span>
                            </div>
                        </div>
                    </div>
                </article>
                <div>
                    {post ?
                        (<PostComments
                            postComments={post.comments}
                            currentUser={currentUser}
                            data={{ postId: post.id, authorId: post.authorId, postSlug: post.slug }}
                        />)
                        : null
                    }
                </div>
            </div>
        </>
    )
}

export default PostBody