"use client"

import { FormEvent, useState } from "react"
import dynamic from "next/dynamic"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import 'react-quill/dist/quill.snow.css'
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import { quillFormats, quillCommentModules } from "@/lib/quillEditorConf"
import { PostComment } from "@/app/models/Comment"
import CommentComponent from "./Comment"
import { useCommentsQuery } from "@/app/hooks/api"
import Modal from "@/app/components/Modal"
import EditReplyComment from "./EditReplyComment"

interface CommentsProps {
    postComments: PostComment[]
    data: {
        postId: string
        postSlug: string
        authorId: string
    }
}

async function createOrUpdateComment({ formData, actionMethod }: { formData: FormData, actionMethod: 'POST' | 'PUT' | 'NONE' }) {
    console.log('params...', formData)
    const createRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/comments/`, {
        method: actionMethod,
        body: formData
    })
    const newComment = (await createRes.json()) as PostComment
    console.info('new comment...', newComment)
    return newComment
}

function PostComments({ data, postComments }: CommentsProps) {
    const [isSaving, setSaving] = useState(false)
    const [content, setContent] = useState('')
    const [action, setAction] = useState<'EDIT' | 'REPLY' | 'NONE'>('NONE')
    const [comment, setComment] = useState<PostComment>()
    const queryClient = useQueryClient()
    const { data: comments, refetch: refetchComments, isLoading } = useCommentsQuery(data.postId, postComments)

    const addCommentMutation = useMutation({
        mutationFn: createOrUpdateComment,
        onSuccess: () => {
            queryClient.setQueryData(['post', data.postSlug],
                (post: any) => {
                    return { ...post, ...{ totalComments: post.totalComments + 1 } }
                }
            )
            refetchComments()
        }
    })

    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault()

        const hasContent = content.length > 0
        if (!hasContent) return

        const formData = new FormData()
        formData.append('content', content)
        formData.append('postId', data.postId as string)
        formData.append('authorId', data.authorId as string)

        try {
            setSaving(true)
            handleComment("POST", formData)
            setContent('')
            setSaving(false)
        } catch (err) {
            console.error(err)
        }
    }

    const handleComment = (action: "POST" | "PUT" | "NONE", formData: FormData | null) => {
        if (action === "NONE" || !formData) {
            setAction('NONE')
            return
        }
        addCommentMutation.mutate({ formData: formData, actionMethod: action })
        setAction('NONE')
    }

    const onContentChange = (value: string) => setContent(value)
    const onActionChange = (value: "EDIT" | "REPLY" | "NONE", comment: PostComment) => {
        setAction(value)
        setComment(comment)
    }

    const getParentComments = () => {
        return comments?.filter(comment => !comment.replyId) || []
    }

    return (
        <>
            <Modal
                isOpen={['EDIT', 'REPLY'].includes(action)}
                onClose={() => setAction('NONE')}
                type="DIALOG"
                style="bg-white dark:bg-slate-600 dark:text-slate-100 w-full md:w-2/3 min-h-[6rem] border rounded-md flex flex-col mx-auto opacity-100 left-1/2 bottom-0 -translate-x-1/2 "
            >
                {comment && <EditReplyComment
                    action={action}
                    comment={comment}
                    postId={comment.postId}
                    authorId={comment.authorId}
                    replyId={action === "REPLY" ? comment.id : undefined}
                    handleFunc={handleComment}
                />}
            </Modal>
            <div id="post-comments-section" className="mx-4 sm:mx-12 py-4">
                <p className="my-2 px-2 font-normal text-sm sm:text-base">Add a comment</p>
                <form
                    id="new-comment-form"
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
                        <button type="submit"
                            className="w-max m-4 py-2 px-6 border-none shadow rounded-full font-semibold text-sm text-gray-50 hover:bg-indigo-500 bg-indigo-400 cursor-pointer">
                            {isSaving ? 'Saving...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>

            <hr className="my-1 dark:border-slate-500" />

            {isLoading && (
                <div className="flex justify-center py-4">Loading comments ...</div>
            )}

            <div id="post-comments-list" className="h-full mx-4 sm:mx-12 py-2">

                <div className="w-full py-4">
                    {comments && comments?.length > 0 ?
                        (
                            <>
                                <h1 className="text-lg">Comments:</h1>
                                <section className="w-full" id="post-comments-list">
                                    {

                                        getParentComments().map(comment => (
                                            <CommentComponent
                                                key={comment.id}
                                                comment={comment}
                                                allComments={comments || []}
                                                setAction={onActionChange}
                                            />
                                        ))
                                    }
                                </section>
                            </>
                        )
                        :
                        <h1 className="text-sm md:text-base">No comments yet!</h1>
                    }
                </div>

                <button
                    id="load-more-comments-btn"
                    className={`w-max flex justify-center items-center mx-auto my-4 px-4 py-2 border rounded-full border-gray-200 text-gray-400 ease-in-out duration-200 hover:text-gray-600 hover:bg-gray-200 hover:border-gray-200 cursor-pointer focus:outline-none`}
                >
                    More comments
                </button>
            </div>
        </>
    )
}

export default PostComments
