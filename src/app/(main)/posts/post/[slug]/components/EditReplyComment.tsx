"use client"

import { UserAvatar } from '@/app/components/CoreComponents'
import { ReplyIcon } from '@/app/components/Icons'
import { PostComment } from '@/app/models/Comment'
import { FormEvent, useState } from 'react'
import Link from "next/link"
import dynamic from "next/dynamic"
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import { quillFormats, quillCommentModules } from "@/lib/quillEditorConf"

interface EditReplyCommentProps {
    comment: PostComment
    postId: string
    authorId: string
    replyId?: string
    action: 'EDIT' | 'REPLY' | 'NONE'
    handleFunc: (method: "POST" | "PUT" | "NONE", data: FormData | null) => void
}

function EditReplyComment(props: EditReplyCommentProps) {

    const [isSaving, setSaving] = useState(false)
    const [content, setContent] = useState(props.action === 'EDIT' ? props.comment.content : '')

    const onContentChange = (value: string) => setContent(value)

    console.log('form data', props.authorId, props.postId, props.replyId)

    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault()

        const hasContent = content.length > 0
        if (!hasContent) return

        const formData = new FormData()
        formData.append('content', content)
        formData.append('postId', props.postId as string)
        formData.append('id', props.comment.id as string)
        formData.append('authorId', props.authorId as string)

        if (props.action === 'REPLY') {
            formData.append('replyId', props.replyId as string)
        }

        try {
            setSaving(true)
            props.handleFunc(props.action === "EDIT" ? "PUT" : "POST", formData)
            setContent('')
            setSaving(false)
        } catch (err) {
            console.error(err)
        }
    }

    return (
        <div id="change-comment-comp" className="p-2 md:p-4 dark:bg-slate-500 dark:text-slate-100">
            {
                props.action === 'EDIT' ? (
                    <h1 className="text-base md:text-xl font-semibold mb-4">
                        Editing comment
                    </h1>
                ) : (
                    <div className="flex items-center gap-2 mb-4" >
                        <div className="w-max p-1 border rounded-lg border-gray-200 text-gray-300">
                            <ReplyIcon />
                        </div>
                        <h1 className="text-base md:text-lg font-medium">
                            Reply to
                        </h1>
                        <div className="flex items-center gap-2">
                            <UserAvatar
                                src={props.comment?.author?.avatarUrl || ''}
                                link={`/user/${props.comment?.author?.username}`}
                                linkClass="w-7 h-7 md:w-8 md:h-8"
                            />
                            <Link
                                href={`/user/${props.comment?.author?.username}`}
                                className="truncate text-sm font-semibold text-gray-700 dark:text-inherit hover:underline"
                            >
                                {props.comment?.author?.username}
                            </Link>
                        </div >
                    </div >
                )
            }

            <form
                id='change-comment-form'
                className="w-full"
                onSubmit={handleFormSubmit}
            >
                <div className="flex flex-col">
                    <ReactQuill
                        theme="snow"
                        value={content}
                        modules={quillCommentModules}
                        formats={quillFormats}
                        onChange={onContentChange}
                    />
                    <div className='flex gap-4'>
                        <button type="submit"
                            className="w-max m-4 py-2 px-6 border-none shadow rounded-full font-semibold text-sm text-gray-50 hover:bg-indigo-500 bg-indigo-400 cursor-pointer">
                            {isSaving ? 'Saving...' : 'Submit'}
                        </button>
                        <button
                            className="w-max m-4 py-2 px-6 shadow rounded-full font-semibold text-sm border border-gray-500 text-gray-50 hover:bg-transparent cursor-pointer"
                            onClick={() => props.handleFunc("NONE", null)}>
                        </button>
                    </div>
                </div>
            </form>
        </div >
    )
}

export default EditReplyComment
