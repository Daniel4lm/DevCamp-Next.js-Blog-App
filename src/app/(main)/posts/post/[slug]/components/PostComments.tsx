"use client"

import { FormEvent, useState } from "react"
import dynamic from "next/dynamic"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import 'react-quill/dist/quill.snow.css'
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })
import { quillFormats, quillCommentModules } from "@/lib/quillEditorConf"
import { PostComment } from "@/models/Comment"
import CommentComponent from "./Comment"
import { useCommentsQuery } from "@/hooks/api"
import Modal from "@/components/Modal"
import EditReplyComment from "./EditReplyComment"
import { User as SessionUser } from "next-auth"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useSession } from "next-auth/react"

interface CommentsProps {
    postComments: PostComment[]
    data: {
        postId: string
        postSlug: string
        authorId: string
    }
    currentUser: SessionUser | undefined
}

async function createUpdateOrDeleteComment({ data, actionMethod }: { data: FormData | string, actionMethod: "POST" | "PUT" | "DELETE" | "NONE" }) {

    const requestData = ['POST', 'PUT'].includes(actionMethod) ? data : JSON.stringify({ commentId: data })

    const createRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/comments/`, {
        method: actionMethod,
        body: requestData
    })
    const comment = (await createRes.json()) as PostComment
    console.info('new or deleted comment...', comment)
    return comment
}

function PostComments({ data, postComments, currentUser }: CommentsProps) {
    const [isSaving, setSaving] = useState(false)
    const [content, setContent] = useState('')
    const [action, setAction] = useState<'EDIT' | 'REPLY' | 'DELETE' | 'NONE'>('NONE')
    const [comment, setComment] = useState<PostComment>()
    const { data: session } = useSession()
    const router = useRouter()
    const queryClient = useQueryClient()
    const { data: comments, refetch: refetchComments, isLoading } = useCommentsQuery(data.postId, postComments)

    const commentMutation = useMutation({
        mutationFn: createUpdateOrDeleteComment,
        onSuccess: (resData, { actionMethod }) => {

            queryClient.setQueryData(['post', data.postSlug],
                (post: any) => {
                    const postUpdate = actionMethod === 'POST' ?
                        { totalComments: post.totalComments + 1 } :
                        actionMethod === 'DELETE' ?
                            { totalComments: post.totalComments - 1 } : {}

                    return { ...post, ...postUpdate }
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
        formData.append('authorId', session?.user.id as string)

        try {
            setSaving(true)
            handleComment("POST", formData)
            setContent('')
            setSaving(false)
        } catch (err) {
            console.error(err)
        }
    }

    const handleComment = (action: "POST" | "PUT" | "DELETE" | "NONE", data: FormData | string | null) => {
        if (action === "NONE" || !data) {
            setAction('NONE')
            return
        }
        commentMutation.mutate({ data: data, actionMethod: action })
        setAction('NONE')
    }

    const onContentChange = (value: string) => setContent(value)
    const onActionChange = (value: 'EDIT' | 'REPLY' | 'DELETE' | 'NONE', comment: PostComment) => {
        setAction(value)
        //router.push(`/posts/post/${}`)
        setComment(comment)

        // if (value === 'DELETE') {
        //     handleComment("DELETE", comment.id)
        // }
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
                {comment ? (
                    <EditReplyComment
                        action={action}
                        comment={comment}
                        postId={comment.postId}
                        authorId={session?.user.id as string}
                        replyId={action === "REPLY" ? comment.id : undefined}
                        handleFunc={handleComment}
                    />
                ) : null}
            </Modal>
            <Modal
                isOpen={action === 'DELETE'}
                onClose={() => setAction('NONE')}
                type="WARN"
                title="Comment delete"
                style="bg-white dark:bg-slate-600 dark:text-slate-100 w-[20rem] sm:w-[24rem] min-h-[6rem] md:w-max border rounded-lg flex flex-col mx-auto opacity-100 left-1/2 top-[50vh] -translate-x-1/2 -translate-y-1/2"
            >
                <p className="mx-auto font-light text-gray-600 dark:text-inherit py-2">
                    Sure you want to delete comment?
                </p>
                <div className="flex justify-center gap-4 mx-auto mt-4">
                    <button className="bg-indigo-400 hover:bg-indigo-500 text-white rounded-full border-none px-4 py-1 font-semibold"
                        onClick={() => setAction('NONE')}
                    >
                        Cancel
                    </button>
                    <button className="border rounded-full border-indigo-400 hover:bg-indigo-500 hover:border-indigo-500 text-indigo-500 hover:text-white px-4 py-1 font-semibold"
                        onClick={() => handleComment("DELETE", comment?.id || '')}
                    >
                        Delete
                    </button>
                </div>
            </Modal>
            {currentUser ? (
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
                                className="w-max m-4 py-2 px-6 border-2 border-indigo-400 rounded-full font-semibold text-sm text-indigo-500 hover:text-gray-50 hover:bg-indigo-500 bg-transparent hover:border-indigo-500 cursor-pointer">
                                {isSaving ? 'Saving...' : 'Submit'}
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div id="post-comments-section" className="px-4 py-8 flex justify-center items-center mt-3 border-t-2 border-gray-100 text-sm md:text-base">
                    <Link
                        href={"/auth/login"}
                        className="text-indigo-500 dark:text-indigo-300 px-4 py-1 border border-indigo-400 dark:border-indigo-300 rounded-full"
                    >
                        Log in to comment
                    </Link>
                </div>
            )}

            <hr className="my-1 dark:border-slate-500" />

            <div id="post-comments-list" className="h-full mx-4 sm:mx-12 py-2">

                <div className="w-full py-4">
                    {isLoading ? (
                        <div className="flex justify-center py-4">Loading comments ...</div>
                    ) : (comments && comments?.length > 0) ?
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
            </div>
        </>
    )
}

export default PostComments
