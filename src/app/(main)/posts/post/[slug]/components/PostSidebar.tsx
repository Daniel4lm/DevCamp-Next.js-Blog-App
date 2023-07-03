"use client"

import { CommentIcon, CopyLinkIcon, DeleteIcon, EditIcon, EmptyHeartIcon, HeartIcon, OptsIcon, PostTagIcon } from "@/app/components/Icons"
import Modal from "@/app/components/Modal"
import ToolTip from "@/app/components/Tooltip"
import useModalShow from "@/app/hooks/useModalShow"
import useOutsideClick from "@/app/hooks/useOutsideClick"
import { copyPostUrl, getURL } from "@/lib/helperFunctions"
import { Post, Tag, User } from "@prisma/client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useRef, useState } from "react"

interface PostProps {
    data: (Post & {
        author: {
            [x: string]: string | number | null;
            [x: number]: string | number | null;
        }
        tags: Tag[]
    } | undefined)
}

interface OptsMenuProps {
    data: (Post & {
        author: {
            [x: string]: string | number | null;
            [x: number]: string | number | null;
        };
        tags: Tag[]
    } | undefined)
    isOpen: 'open' | 'close'
    closeFunc: () => void
}

const OptsMenu = ({ data, isOpen, closeFunc }: OptsMenuProps) => {

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
        console.log('delete post...', id)

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
                        <CopyLinkIcon />
                    </div>
                    {isCopied && (<div className="bg-sky-100 dark:bg-slate-400 rounded-md px-4 py-1 mt-2">
                        Copied to Clipboard
                    </div>)}

                </li>
                {data?.author.email &&
                    <div
                        id={`delete-post-${data.id}`}
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
                }
                {data?.author.email &&
                    (<Link
                        id="edit-post-#{@post.id}"
                        href={`/posts/edit?slug=${data.slug}`}
                    >
                        <li className="py-2 px-2 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-400 dark:hover:bg-opacity-50 cursor-pointer">
                            <div className="flex items-center justify-between">
                                <span>Edit post</span>
                                <div className="p-1"><EditIcon /></div>
                            </div>
                        </li>
                    </Link>)
                }
            </ul>
        </>
    )
}

const PostSidebar = ({ data }: PostProps) => {

    const [menuOpen, setMenuOpen] = useState<'open' | 'close'>('close')

    const closeMenu = () => setMenuOpen('close')
    const handleMenuOpen = () => setMenuOpen(menuOpen === 'open' ? 'close' : 'open')

    const scrollToComments = () => {
        const commentsSection = document.getElementById('post-comments-section')
        commentsSection && commentsSection.scrollIntoView({ behavior: 'smooth', block: "start" })
    }

    return (
        <aside
            className="fixed sm:sticky w-max sm:w-max h-max z-[10] left-1/2 bottom-2 -translate-x-1/2 sm:translate-x-0 sm:left-auto sm:top-14 sm:p-6 border dark:text-slate-100 border-gray-300 rounded-full bg-white dark:bg-navbar-dark-github sm:dark:bg-transparent sm:border-0 sm:bg-transparent"
            aria-label="Post actions"
        >
            <div className="flex justify-around items-center gap-x-2 px-4 sm:px-0 sm:flex-col sm:gap-x-0 rounded-full">

                <ToolTip position="side" title="Like the Post">
                    <div className="flex sm:flex-col py-2 items-center cursor-pointer">
                        {data?.author.email ?
                            (<div className="rounded-full p-2 cursor-pointer border border-transparent hover:border-red-200 hover:bg-red-100 dark:hover:bg-transparent dark:hover:border-transparent">
                                {/* {<.live_component
                                    id="post-like-comp"
                                    module={LikeComponent}
                                    current_user={@current_user}
                                    resource={@post}
                                    resource_name={:post}
                                />} */}
                                <EmptyHeartIcon />
                            </div>)
                            :
                            (<div id="post-like-icon" className="py-2">
                                <HeartIcon />
                            </div>)
                        }
                        <span id="post-total-likes" className="mx-1 sm:mx-2">{data?.totalLikes}</span>
                    </div>
                </ToolTip>

                <ToolTip position="side" title="Jump to comments">
                    <div className="flex sm:flex-col py-2 items-center cursor-pointer">
                        <div
                            id="post-comment-icon"
                            className="rounded-full p-2 border border-transparent hover:border-orange-200 hover:bg-orange-100 hover:text-amber-500 dark:hover:bg-transparent dark:hover:border-transparent"
                            onClick={scrollToComments}
                        >
                            <CommentIcon />
                        </div>
                        <span id="post-total-comments" className="mx-1 sm:mx-2">{data?.totalComments}</span>
                    </div>
                </ToolTip>

                <ToolTip position="side" title="Tag the Post">
                    <div className="flex sm:flex-col py-2 items-center cursor-pointer">
                        {data?.author.email ?
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
                    {menuOpen === 'open' && <OptsMenu data={data} isOpen={menuOpen} closeFunc={closeMenu} />}
                </div >
            </div >
        </aside >
    )
}

export default PostSidebar
