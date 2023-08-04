"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { CommentIcon, CopyLinkIcon, DeleteIcon, EditIcon, EmptyHeartIcon, HeartIcon, LinkIcon, OptsIcon, PostTagIcon } from "@/app/components/Icons"
import Modal from "@/app/components/Modal"
import ToolTip from "@/app/components/Tooltip"
import useModalShow from "@/app/hooks/useModalShow"
import useOutsideClick from "@/app/hooks/useOutsideClick"
import { User as SessionUser } from "next-auth"

import { copyPostUrl, getURL } from "@/lib/helperFunctions"
import { Post, Tag, Like, Prisma } from "@prisma/client"
import { PostComment } from "@/models/Comment"

import { usePathname, useRouter } from "next/navigation"
import SmartLink from "@/app/components/navigation/SmartLink"
import LikeComponent from "@/app/components/LikeComponent"

interface PostProps {
    data: (Post & {
        author: {
            [x: string]: string | number | null
            [x: number]: string | number | null
        }
        tags: Tag[]
        likes: Like[]
        comments: PostComment[]
    } | undefined)
    currentUser: SessionUser | undefined
}

interface OptsMenuProps {
    data: (Post & {
        author: {
            [x: string]: string | number | null
            [x: number]: string | number | null
        };
        tags: Tag[]
        likes: Like[]
        comments: PostComment[]
    } | undefined)
    currentUser: SessionUser | undefined
    isOpen: 'open' | 'close'
    closeFunc: () => void
}

const OptsMenu = ({ data, currentUser, isOpen, closeFunc }: OptsMenuProps) => {

    const [isCopied, setIsCopied] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const menuRef = useRef(null)
    const { setShow, show, onHide } = useModalShow()
    useOutsideClick(menuRef, closeFunc)

    const showDeleteModal = () => {
        setShow(true)
    }

    const deletePost = async (id: string) => {

        await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/delete`, {
            method: 'POST',
            body: JSON.stringify({ id }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        setShow(false)
        closeFunc()
        router.push(`/user/${data?.author.username}`)
    }

    const handleCopied = (copied: boolean) => setIsCopied(copied)

    const copyUrl = () => {
        const url = getURL(pathname)
        copyPostUrl(url, handleCopied)
    }

    return (
        <>
            <Modal
                isOpen={show}
                onClose={onHide}
                title={data?.title}
                type="DIALOG"
                style="bg-white dark:bg-slate-600 dark:text-slate-100 w-[20rem] sm:w-[24rem] min-h-[6rem] md:w-max border rounded-lg flex flex-col mx-auto opacity-100 left-1/2 top-[50vh] -translate-x-1/2 -translate-y-1/2"
            >
                <p className="mx-auto font-light text-gray-600 dark:text-inherit py-2">
                    Sure you want to delete the post {data?.title}?
                </p>
                <div className="flex justify-center gap-4 mx-auto mt-2">
                    <button className="bg-indigo-400 hover:bg-indigo-500 text-white rounded-full border-none px-4 py-1 font-semibold"
                        onClick={onHide}
                    >
                        Cancel
                    </button>
                    <button className="border rounded-full border-indigo-400 hover:bg-indigo-500 hover:border-indigo-500 text-indigo-500 hover:text-white px-4 py-1 font-semibold"
                        onClick={() => deletePost(data!.id)}
                    >
                        Delete
                    </button>
                </div>
            </Modal>
            <ul
                id="opts-menu"
                ref={isOpen === 'open' ? menuRef : null}
                className="absolute min-w-[14rem] h-max bg-white dark:bg-menu-dark-github dark:text-slate-100 rounded-lg border border-gray-300 dark:border-gray-500 bottom-full -right-1/2 sm:top-0 sm:left-full sm:ml-1 p-2"
            >
                <li className="py-2 px-2 rounded-md">
                    <div
                        id="copy-url-picker"
                        className="flex justify-between cursor-pointer"
                        onClick={copyUrl}
                    >
                        <span>Copy link</span>
                        <LinkIcon />
                    </div>
                    {isCopied ? (
                        <div className="bg-sky-100 dark:bg-slate-400 rounded-md px-4 py-1 mt-2">
                            Copied to Clipboard
                        </div>
                    ) : null}

                </li>
                {currentUser && currentUser.id === data?.authorId ?
                    (
                        <>
                            <div
                                id={`delete-post-${data?.id}`}
                                className="cursor-pointer"
                                onClick={showDeleteModal}
                            >
                                <li className="py-2 px-2 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-400 dark:hover:bg-opacity-50">
                                    <div className="flex items-center justify-between">
                                        <span>Delete post</span>
                                        <div className="p-1"><DeleteIcon /></div>
                                    </div>
                                </li>
                            </div>

                            <Link
                                id="edit-post-#{@post.id}"
                                href={`/posts/edit?slug=${data?.slug}`}
                            >
                                <li className="py-2 px-2 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-400 dark:hover:bg-opacity-50 cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <span>Edit post</span>
                                        <div className="p-1"><EditIcon /></div>
                                    </div>
                                </li>
                            </Link>
                        </>
                    ) : null
                }
            </ul>
        </>
    )
}

const PostSidebar = ({ data, currentUser }: PostProps) => {

    const [menuOpen, setMenuOpen] = useState<'open' | 'close'>('close')

    const closeMenu = () => setMenuOpen('close')
    const handleMenuOpen = () => setMenuOpen(menuOpen === 'open' ? 'close' : 'open')

    // const scrollToComments = (elemId: string) => {
    //     const commentsSection = document.getElementById(elemId)
    //     // commentsSection && commentsSection.scrollIntoView({ behavior: 'smooth', block: "start" })
    //     commentsSection && window.scrollTo({ behavior: 'smooth', top: commentsSection?.getBoundingClientRect().top })
    // }

    function isLiked(currentUser: SessionUser | undefined, data: (Post & {
        comments: PostComment[]
        author: { [x: string]: string | number | null }
        likes: Like[]
        tags: Tag[]
    } | undefined)) {
        return data?.likes.some(like => like.authorId === currentUser?.id)
    }

    useEffect(() => {

        const postSidebar = document.getElementById('post-sidebar')
        
        function handlePageScroll() {
            if (window.scrollY > 100) {
                postSidebar?.classList.replace('opacity-0', 'opacity-1')
                postSidebar?.classList.replace('translate-y-1/2', '-translate-y-1/2')
            } else {
                postSidebar?.classList.replace('opacity-1', 'opacity-0')
                postSidebar?.classList.replace('-translate-y-1/2', 'translate-y-1/2')
            }
        }

        handlePageScroll()

        postSidebar && window.innerWidth < 768 && window.addEventListener('scroll', handlePageScroll)
        return () => window.removeEventListener('scroll', handlePageScroll)
    }, [])


    return (
        <aside
            id="post-sidebar"
            className="fixed sm:sticky w-max sm:w-max h-max z-[10] left-1/2 bottom-2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:top-14 sm:p-6 border dark:text-slate-100 border-gray-300 rounded-full bg-white dark:bg-navbar-dark-github sm:dark:bg-transparent sm:border-0 sm:bg-transparent"
            aria-label="Post actions"
        >
            <div className="flex justify-around items-center gap-x-2 px-4 sm:px-0 sm:flex-col sm:gap-x-0 rounded-full">
                <ToolTip position="right" title="Like the Post">
                    <LikeComponent
                        currentUser={currentUser}
                        resource={data as Post}
                        resourceType="post"
                        isLiked={isLiked(currentUser, data) || false}
                    />
                </ToolTip>

                <ToolTip position="right" title="Jump to comments">
                    <div className="flex sm:flex-col py-2 items-center">
                        <SmartLink
                            href="#post-comments-section"
                            isScrollAble
                        >
                            <div
                                id="post-comment-icon"
                                className="rounded-full p-2 cursor-pointer border border-transparent hover:border-orange-200 hover:bg-orange-100 hover:text-amber-500 dark:hover:bg-transparent dark:hover:border-transparent"
                            >
                                <CommentIcon />
                            </div>
                        </SmartLink>
                        <span id="post-total-comments" className="mx-1 sm:mx-2">{data?.totalComments}</span>
                    </div>
                </ToolTip>

                <ToolTip position="right" title="Tag the Post">
                    <div className="flex sm:flex-col py-2 items-center">
                        {currentUser && currentUser.id !== data?.authorId ?
                            (<div className="rounded-full p-2 cursor-pointer border border-transparent hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50 dark:hover:bg-transparent dark:hover:border-transparent">
                                {/* <.live_component
                                    id="post-tag-comp"
                                    module={TagComponent}
                                    current_user={@current_user}
                                    post={@post}
                                /> */}
                                <PostTagIcon />
                            </div>)
                            :
                            (<div id="post-like-icon" className="py-2">
                                <PostTagIcon />
                            </div>)
                        }
                        <span id="post-total-taged" className="mx-1 sm:mx-2">0</span>
                    </div>
                </ToolTip>

                <div id="post-opts" className="relative flex sm:flex-col py-2 items-center">
                    <div
                        id="post-options-icon"
                        className="relative hover-item rounded-full p-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-500"
                        phx-hook="ToolTip"
                        onClick={handleMenuOpen}
                    >
                        <OptsIcon />
                        <span className="top-tooltip-text px-4 py-2 rounded-md bg-gray-800 text-white text-sm ">
                            Other options
                        </span>
                    </div>
                    {menuOpen === 'open' ?
                        (
                            <OptsMenu
                                data={data}
                                currentUser={currentUser}
                                isOpen={menuOpen}
                                closeFunc={closeMenu}
                            />
                        ) : null}
                </div>
            </div>
        </aside>
    )
}

export default PostSidebar
