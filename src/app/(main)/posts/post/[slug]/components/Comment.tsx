import { UserAvatar } from "@/components/CoreComponents"
import { DeleteIcon, EditIcon, OptsIcon } from "@/components/Icons"
import LikeComponent from "@/components/posts-comments/LikeComponent"
import useOutsideClick from "@/hooks/useOutsideClick"
import { PostComment } from "@/models/Comment"
import { formatPostDate } from "@/lib/helperFunctions"
import { useSession } from "next-auth/react"
import { User as SessionUser } from "next-auth"
import Link from "next/link"
import { useRef, useState } from "react"

interface CommentProps {
    comment: PostComment,
    density?: number
    allComments: PostComment[]
    setAction: (val: 'EDIT' | 'REPLY' | 'DELETE' | 'NONE', comment: PostComment) => void
}

const Comment = ({ comment, density = 0, allComments, setAction }: CommentProps) => {

    const [optsMenu, SetOptsMenu] = useState(false)
    const { data: sessionData } = useSession()
    const optsRef = useRef(null)

    const handleOptsMenu = () => SetOptsMenu(state => !state)

    useOutsideClick(optsRef, () => SetOptsMenu(false))

    function manageComment(action: 'EDIT' | 'REPLY' | 'DELETE' | 'NONE', comment: PostComment) {
        setAction(action, comment)
        SetOptsMenu(false)
    }

    const childComments = () => {
        return allComments.filter(c => c.replyId === comment.id)
    }

    function isLiked(currentUser: SessionUser | undefined, data: (PostComment | undefined)) {
        return data?.likes?.some(like => like.authorId === currentUser?.id)
    }

    return (
        <div style={{ marginLeft: `${density}px` }}>
            <div className="w-full my-4 dark:text-slate-100" id={`user-comment-${comment.id}`}>
                <div className="flex items-start gap-2">
                    <UserAvatar
                        src={comment.author?.avatarUrl || ''}
                        link={`/user/${comment.author?.username}`}
                        linkClass="w-7 h-7 md:w-8 md:h-8"
                    />

                    <div className="relative flex-1">
                        <div className="relative w-full flex flex-col p-2 bg-gray-50 text-gray-700 dark:text-slate-100 border rounded-lg dark:border-slate-500 dark:bg-slate-600">
                            <div className="flex items-center justify-between xs:px-2 rounded-t-md">
                                <div className="flex items-center gap-1">
                                    <Link
                                        href={`/user/${comment.author?.username}`}
                                        className="truncate text-sm font-semibold dark:text-inherit hover:underline"
                                    >
                                        {comment.author?.username}
                                    </Link>
                                    <p className="flex text-sm gap-1">
                                        •
                                        {comment.createdAt ? (
                                            <time
                                                dateTime={new Date(comment?.createdAt).toISOString()}
                                                title={formatPostDate(comment.createdAt)}
                                            >
                                                {formatPostDate(comment.createdAt)}
                                            </time>
                                        ) : null}
                                    </p>
                                    {
                                        comment.replyId ? (
                                            <svg
                                                width="30"
                                                height="30"
                                                viewBox="0 0 30 30"
                                                fill="currentColor"
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-[1.2rem] h-[1.2rem] m-1 text-indigo-400 dark:text-slate-100"
                                            >
                                                <path d="M12.617 7.51607V8.21607H13.317C22.1692 8.21607 29.303 15.1219 29.3 23.5858V23.5861C29.3 25.029 29.091 26.4233 28.7033 27.7476C26.4788 21.7677 20.1769 17.5131 13.3328 17.5131H12.6328V18.2131C12.6328 18.3938 12.6281 19.9686 12.6233 21.5009L12.6168 23.5834L12.6146 24.2616L12.614 24.4508L12.6138 24.5005L12.6138 24.5133L12.6138 24.5165L12.6138 24.5173L12.6138 24.5175L13.3138 24.5198L12.6138 24.5176L12.6136 24.5613L12.6189 24.6047C12.6324 24.7151 12.6053 24.8005 12.5571 24.8593L12.5166 24.9003L12.4654 24.9478C12.3951 25.0034 12.3038 25.0383 12.2018 25.0383C12.09 25.0383 11.9811 24.9874 11.8953 24.884L11.8807 24.8665L11.865 24.8499L0.827688 13.1916L0.818283 13.1816L0.808497 13.1721C0.729023 13.0944 0.695195 12.9947 0.700583 12.897L0.70267 12.8592L0.700668 12.8214C0.694566 12.7062 0.728585 12.6209 0.801644 12.5514L0.815078 12.5387L0.827818 12.5252L11.9126 0.810328C12.0817 0.66068 12.3629 0.663268 12.528 0.818092C12.6028 0.891114 12.6376 0.984987 12.6218 1.11768L12.617 1.15876V1.20012V7.51607ZM12.9992 24.7077H12.9702C12.9915 24.7068 13.0024 24.7077 12.9992 24.7077Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                />
                                            </svg>
                                        ) : null
                                    }
                                </div>
                                {sessionData?.user && sessionData?.user.id === comment?.authorId ?
                                    (
                                        <div className="relative cursor-pointer">
                                            <div
                                                id={`comments-option-${comment.id}`}
                                                className="relative rounded-lg p-1 hover:bg-neutral-200 dark:hover:bg-slate-500"
                                                onClick={handleOptsMenu}
                                                ref={optsRef}
                                            >
                                                <OptsIcon />
                                            </div>
                                            <ul className={`absolute ${optsMenu ? 'block' : 'hidden'} z-10 min-w-[10rem] w-max bg-white dark:bg-menu-dark-github dark:text-slate-100 dark:border-gray-500 top-full mt-1 right-0 rounded-lg border border-gray-300 p-1 text-sm sm:text-base`}>
                                                <li className="py-2 px-2 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-400 dark:hover:bg-opacity-50">
                                                    <div className="flex items-center justify-between gap-2"
                                                        onClick={() => manageComment("DELETE", comment)}
                                                    >
                                                        <span>Delete</span>
                                                        <DeleteIcon />
                                                    </div>
                                                </li>
                                                <li className="py-2 px-2 rounded-md cursor-pointer hover:bg-indigo-50 dark:hover:bg-slate-400 dark:hover:bg-opacity-50">
                                                    <div className="flex items-center justify-between gap-2"
                                                        onClick={() => manageComment("EDIT", comment)}
                                                    >
                                                        <span>Edit</span>
                                                        <div className="p-1"><EditIcon /></div>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    ) : null
                                }
                            </div>

                            <div className="xs:p-2 mt-2 text-sm sm:text-base text-gray-700 dark:text-inherit">
                                <div dangerouslySetInnerHTML={{ __html: comment.content }} ></div>
                            </div>

                        </div>
                        {sessionData?.user ? (
                            <div className="flex justify-between items-center m-2 text-sm font-medium">
                                <div className="flex items-center">
                                    <LikeComponent
                                        currentUser={sessionData.user}
                                        resource={comment}
                                        resourceType="comment"
                                        isLiked={isLiked(sessionData.user, comment) || false}
                                    />

                                </div>

                                <div
                                    className="flex items-center gap-2 ml-1 px-3 py-1 border bg-gray-50 dark:bg-transparent border-gray-250 dark:border-slate-400 rounded-full hover:bg-gray-100 dark:hover:bg-slate-500 hover:cursor-pointer"
                                    onClick={() => manageComment("REPLY", comment)}
                                >
                                    <span>Reply to</span>
                                </div>
                            </div>
                        ) : null}

                    </div>
                </div>
            </div>
            {
                childComments().map(comment => (
                    <Comment
                        key={comment.id}
                        density={32}
                        comment={comment}
                        allComments={allComments}
                        setAction={setAction}
                    />
                ))
            }
        </div>
    )
}

export default Comment
