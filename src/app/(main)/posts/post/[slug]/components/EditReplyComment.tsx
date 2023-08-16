"use client"

import { UserAvatar } from '@/components/CoreComponents'
import { ReplyIcon } from '@/components/Icons'
import { PostComment } from '@/models/Comment'
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
    action: 'EDIT' | 'REPLY' | 'DELETE' | 'NONE'
    handleFunc: (method: "POST" | "PUT" | "NONE", data: FormData | null) => void
}

function EditReplyComment(props: EditReplyCommentProps) {

    const [isSaving, setSaving] = useState(false)
    const [content, setContent] = useState(props.action === 'EDIT' ? props.comment.content : '')

    const onContentChange = (value: string) => setContent(value)

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
                        </div>
                    </div>
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
                    <div className='flex gap-2'>
                        <button type="submit"
                            className="w-max m-2 py-2 px-6 border-none rounded-full font-semibold text-xs xs:text-sm text-gray-50 hover:bg-indigo-500 bg-indigo-400 cursor-pointer">
                            {isSaving ? 'Saving...' : 'Submit'}
                        </button>
                        <button
                            className="w-max my-2 py-2 px-6 rounded-full font-semibold text-xs xs:text-sm border-2 border-indigo-400 text-indigo-500 hover:bg-indigo-500 hover:border-indigo-500 hover:text-white cursor-pointer"
                            onClick={() => props.handleFunc("NONE", null)}>
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default EditReplyComment
