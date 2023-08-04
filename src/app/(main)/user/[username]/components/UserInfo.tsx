"use client"

import { CommentIcon, GlobeIcon, PinIcon, PostIcon, TagIcon } from "@/app/components/Icons"
import DefaultAvatar from 'public/defaultAvatar.png'
import { useFollowingsQuery, useUserQuery } from "@/app/hooks/api"
import { displayWebsiteUri } from "@/lib/formHelpers"
import Image from "next/image"
import Link from "next/link"
import { User as SessionUser } from "next-auth"
import { Post, Profile, Tag, User } from "@prisma/client"
import FollowList from "./FollowList"
import { UserButton } from "./UserButton"
import UserInfoSkeleton from "@/app/components/skeletons/UserInfoSkeleton"

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

interface UserFollowingProps {
    followed: User,
    follower: User
}

function UserInfo({ user, currentUser }: { user: UserDataProps, currentUser: SessionUser | undefined }) {

    const { data: userInfo, refetch: refetchUserData, isLoading: isUserLoading, isSuccess: isUserSuccess } = useUserQuery(user.username, user)
    const { data: followData, refetch: refetchUserFollow, isLoading: isFollowLoading, isSuccess: isFollowSuccess } = useFollowingsQuery(user.username, user?.id || '')

    function refetchAllUserData() {
        refetchUserData()
        refetchUserFollow()
    }

    const isFoolowed = isFollowSuccess && followData.followers.find((followerData: UserFollowingProps) => followerData.follower.id === currentUser?.id)

    return (
        <>
            {isUserSuccess && isFollowSuccess ? (
                <>
                    <section className="relative flex justify-center items-center flex-col w-full sm:w-10/12 md:w-2/3 xl:w-3/6 mx-auto md:px-10 pt-10 mt-16 pb-4 bg-white dark:bg-[#344453] dark:text-slate-300 border-t sm:border dark:border-gray-600 sm:rounded-lg sm:shadow-md sm:shadow-slate-100 dark:shadow-none">
                        <div className="w-full mb-4">
                            <Image
                                alt="User Avatar"
                                src={(userInfo?.avatarUrl !== 'undefined' ? userInfo?.avatarUrl : DefaultAvatar.src) || DefaultAvatar.src}
                                width={255}
                                height={255}
                                className="absolute xs:relative w-20 h-20 xs:w-28 xs:h-28 ml-4 xs:mx-auto -mt-20 bg-white dark:bg-slate-400 border-2 md:border-4 border-indigo-200 dark:border-slate-400 p-[0.2rem] rounded-full object-cover object-center"
                            />
                        </div>

                        <div className="w-full">
                            <div className="flex flex-col xs:items-center p-4">
                                <div className="flex items-center gap-2 md:flex-col">
                                    <h2 className="text-xl md:text-2xl font-semibold my-2">
                                        {userInfo?.fullName}
                                    </h2>
                                </div>
                                <p className="max-w-full break-words my-2">
                                    {userInfo?.profile?.bio ? <span>{userInfo?.profile?.bio}</span> : <span>No bio found</span>}
                                </p>
                            </div>

                            <ul className="flex xs:justify-center flex-wrap gap-2 xs:gap-8 px-4 xs:p-0 text-sm md:text-base">
                                {
                                    userInfo?.profile?.location ? (
                                        <li
                                            id="profile-posts-count"
                                            className="flex items-center justify-center my-1 ml-2 xs:ml-0"
                                        >
                                            <div className="text-indigo-500 dark:text-blue-400 mr-1"><PinIcon /></div>
                                            <span>Location <b>{userInfo?.profile?.location}</b></span>
                                        </li>
                                    ) : null
                                }
                                {
                                    userInfo?.profile?.website ? (
                                        <Link href={userInfo?.profile?.website}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center justify-center my-1 px-2 py-1 text-sm xs:text-base rounded-full hover:bg-gray-100 dark:hover:bg-slate-500"
                                        >
                                            <div className="text-indigo-500 dark:text-blue-400 mr-1"><GlobeIcon /></div>
                                            <span className="font-medium mr-1">{displayWebsiteUri(userInfo?.profile?.website)}</span>
                                        </Link>
                                    ) : null
                                }
                            </ul>

                            <div className="absolute flex flex-col md:flex-row items-center md:justify-start px-3 top-3 right-2">
                                <UserButton
                                    user={user}
                                    currentUser={currentUser}
                                    maybeUserFollow={isFoolowed ? true : false}
                                    refetch={refetchAllUserData}
                                />
                            </div>

                            <FollowList
                                followData={followData}
                                currentUser={currentUser}
                                user={userInfo}
                                refetch={refetchAllUserData}
                            />
                        </div>
                    </section>

                    <section className="flex xs:justify-center xs:items-center flex-col w-full sm:w-10/12 md:w-2/3 xl:w-3/6 mx-auto px-4 xs:px-10 py-2 sm:my-4 bg-white dark:bg-[#344453] text-gray-600 dark:text-slate-300 sm:rounded-lg border-b sm:border dark:border-gray-600 shadow-md dark:shadow-none shadow-slate-100">
                        <p className="text-md md:text-lg font-semibold my-2">Recent activity</p>

                        <ul className="flex xs:justify-center flex-wrap gap-x-8 md:p-2 text-sm md:text-base">
                            <li className="flex items-center justify-center my-1" id="profile-posts-count">
                                <div className="text-indigo-500 dark:text-blue-400 mr-1"><PostIcon /></div>
                                <span className='hidden xs:block'>Posts <b>{userInfo?.postsCount}</b></span>
                                <span className='block xs:hidden'><b>{userInfo?.postsCount}</b></span>
                            </li>
                            <li className="flex items-center justify-center my-1 " id="profile-comments-count">
                                <div className="text-indigo-500 dark:text-blue-400 mr-1"><CommentIcon /></div>
                                <span className='hidden xs:block'>Comments <b>0</b></span>
                                <span className='block xs:hidden'><b>0</b></span>
                            </li>
                            <li className="flex items-center justify-center my-1 " id="profile-taged-count">
                                <div className="text-indigo-500 dark:text-blue-400 mr-1"><TagIcon /></div>
                                <span className='hidden xs:block'>Taged posts <b>0</b></span>
                                <span className='block xs:hidden'><b>0</b></span>
                            </li>
                        </ul>
                    </section>

                </>
            ) : <UserInfoSkeleton />}
        </>
    )
}

export default UserInfo
