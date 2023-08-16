"use client"

import { useState } from "react"
import Link from "next/link"
import { User as SessionUser } from "next-auth"
import { Post, Profile, Tag, User, UserFollower } from "@prisma/client"
import { UserIcon } from "@/components/Icons"
import { UserButton } from "./UserButton"
import { UserAvatar } from "@/components/CoreComponents"
import Modal from "@/components/Modal"


interface UserDataProps {
    id: string
    avatarUrl: string | null
    email: string
    username: string
    fullName: string
    postsCount: number
    role: "user" | "admin"
    profile: Profile | null
    posts?: (Post & {
        author: User;
        tags: Tag[]
    })[],
    followersCount: number
    followingCount: number
}

interface FollowListProps {
    followData: UserFollowingListProps
    currentUser: SessionUser | undefined
    user: UserDataProps
    refetch?: () => void
}

interface UserFollowingListProps {
    followers: User[],
    followings: User[]
}

function FollowList({ followData, currentUser, user, refetch }: FollowListProps) {

    const [followSection, setFollowSection] = useState<'followings' | 'followers' | 'none'>('none')
    const followList = followData && followSection !== 'none' ? followData[followSection] : []

    function getFollowUser(follow: any) {
        if (followSection === 'followers') {
            return follow.follower
        } else {
            return follow.followed
        }
    }

    return (
        <>
            <Modal
                isOpen={['followings', 'followers'].includes(followSection)}
                onClose={() => setFollowSection('none')}
                type="DIALOG"
                title={followSection}
                style="bg-white dark:bg-slate-600 dark:text-slate-100 w-full md:w-2/3 lg:w-1/2 min-h-[6rem] border rounded-md flex flex-col mx-auto opacity-100 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
                {
                    followList.map((follow: any) => {

                        const followUser = getFollowUser(follow)
                        const userFollowings: UserFollower[] = followUser.followings
                        const maybeUserFollow = userFollowings.some(following => following.followerId === currentUser?.id)

                        return (
                            <div key={followUser.id} className="xs:p-4">
                                <div className="flex items-center">
                                    <UserAvatar
                                        link={`/user/${followUser.username}`}
                                        src={followUser.avatarUrl as string || ''}
                                        linkClass="w-8 h-8 md:w-10 md:h-10"
                                    />

                                    <div className="ml-3">
                                        <Link
                                            href={`/user/${followUser.username}`}
                                            className="font-semibold text-sm truncate hover:underline"
                                        >
                                            {followUser.username}
                                        </Link>
                                        <h6
                                            id={"follow-name-#{get_follow_user(follow, @action).id}"}
                                            className="font-semibold text-sm truncate text-gray-400 dark:text-slate-100"
                                        >
                                            {followUser.fullName}
                                        </h6>
                                    </div>
                                    {currentUser && currentUser.id !== followUser.id && (
                                        <span className="ml-auto">
                                            <UserButton
                                                currentUser={currentUser}
                                                user={followUser}
                                                maybeUserFollow={maybeUserFollow}
                                                refetch={refetch}
                                            />
                                        </span>
                                    )}
                                </div>
                            </div>)
                    })
                }
                {!followList.length && (<div className="p-4">Empty list</div>)}
            </Modal>

            <ul className="flex xs:justify-center flex-wrap gap-2 xs:gap-8 px-4 xs:p-0 text-sm md:text-base">
                <li
                    className="flex items-center justify-center cursor-pointer my-1 px-3 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-500"
                    id="profile-followers-count"
                    onClick={() => setFollowSection('followers')}
                >
                    <div className="text-indigo-500 dark:text-blue-400 mr-1"><UserIcon /></div>
                    <span>Followers <b>{user.followersCount}</b></span>
                </li>

                <li
                    className="flex items-center justify-center cursor-pointer my-1 px-3 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-500"
                    id="profile-following-count"
                    onClick={() => setFollowSection('followings')}
                >
                    <div className="text-indigo-500 dark:text-blue-400 mr-1"><UserIcon /></div>
                    <span>Following <b>{user.followingCount}</b></span>
                </li>
            </ul>
        </>
    )
}

export default FollowList
