"use client"

import { useEffect, useState } from "react"
import Link from 'next/link'
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { User as SessionUser } from "next-auth"
import { User } from "@/models/User"

interface UserButtonProps {
    currentUser: SessionUser | undefined
    user: User
    maybeUserFollow?: boolean
    isSaving: boolean
}

const ButtonStyle = {
    unfollow: 'py-1 px-4 text-red-500 border-2 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-transparent focus:outline-none',
    follow: 'py-1 px-4 border-2 border-[#6B78F3] rounded-full font-semibold hover:bg-[#6B78F3] text-[#6B78F3] hover:text-white focus:outline-none'
}

async function handleFollowUser({ username, method }: { username: string, method: 'POST' | 'DELETE' }) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${username}/follow`, {
        method: method,
        body: JSON.stringify({ username })
    })
    return await res.json()
}

function UserButton({ currentUser, user, maybeUserFollow, isSaving }: UserButtonProps) {

    const [stateText, setStateText] = useState<'follow' | 'unfollow'>('follow')
    const queryClient = useQueryClient()

    useEffect(() => {
        setStateText(maybeUserFollow ? 'unfollow' : 'follow')
    }, [maybeUserFollow])

    function revalidateUserData() {
        return Promise.all([
            queryClient.invalidateQueries(['user', user.username]),
            queryClient.invalidateQueries([`user-${user.username}-followings`]),
            queryClient.invalidateQueries(['user', currentUser?.username]),
            queryClient.invalidateQueries([`user-${currentUser?.username}-followings`])
        ])
    }

    const followUserMutation = useMutation({
        mutationFn: handleFollowUser,
        onSuccess: () => {
            setStateText('unfollow')
            revalidateUserData()
        },
    })

    const unfollowUserMutation = useMutation({
        mutationFn: handleFollowUser,
        onSuccess: () => {
            setStateText('follow')
            revalidateUserData()
        },
    })
    const mutationFunction = maybeUserFollow
        ? unfollowUserMutation
        : followUserMutation

    const changeFollowStatus = () => {
        mutationFunction.mutate({
            username: user.username,
            method: stateText === 'follow' ? 'POST' : 'DELETE'
        })
    }

    function compareUsers() {
        if (!currentUser) {
            return <RenderLoginLink stateText={stateText} />
        } else if (currentUser?.id === user?.id) {
            return <RenderUserEdit username={user?.username || ''} />
        } else {
            return <RenderFollowLink stateText={stateText} changeFun={changeFollowStatus} isSaving={isSaving} />
        }
    }

    return (<>{compareUsers()}</>)
}

function RenderFollowLink({ stateText, changeFun, isSaving }: { stateText: string, changeFun: () => void, isSaving: boolean }) {
    return (
        <button
            id="follow-component"
            className="focus:outline-none"
            onClick={changeFun}
        >
            <span id="follow-state" className={`block ${ButtonStyle[stateText as keyof typeof ButtonStyle]} first-letter:uppercase `}>
                {
                    isSaving ? (
                        <span className={
                            "flex items-center transition ease-in-out duration-150 cursor-not-allowed w-full h-auto"
                        }>
                            <svg
                                className="animate-spin -ml-1 mr-3 h-6 w-6"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4">
                                </circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                >
                                </path>
                            </svg>
                            Saving
                        </span>
                    ) : (
                        <span>{stateText}</span>
                    )
                }
            </span>

        </button>
    )
}

function RenderLoginLink({ stateText }: { stateText: string }) {
    return (
        <div className="my-2">
            <Link
                href={'/auth/login'}
                className={`py-1 px-5 first-letter:uppercase ${ButtonStyle[stateText as keyof typeof ButtonStyle]}`}
            >
                {stateText === 'follow' ? 'Follow' : 'Unfollow'}
            </Link>
        </div>
    )
}

function RenderUserEdit({ username }: { username: string }) {
    return (
        <div className="my-2">
            <Link
                href={`/settings/account/${username}`}
                className="py-1 px-4 border-2 rounded-full font-semibold hover:bg-gray-50 dark:hover:bg-inherit"
            >
                Edit Profile
            </Link>
        </div>
    )
}

export { UserButton, RenderFollowLink, RenderUserEdit }
