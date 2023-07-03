import { notFound } from "next/navigation"
import { Metadata } from "next"
import Link from "next/link"
import Image from 'next/image'
import { Post, Profile, Tag, User } from "@prisma/client"
import DefaultAvatar from 'public/defaultAvatar.png'
import { CommentIcon, GlobeIcon, PinIcon, PostIcon, TagIcon } from "@/app/components/Icons"
import { displayWebsiteUri } from "@/lib/formHelpers"
import UserTask from "@/lib/user"
import PostsList from "./PostsList"

type PostProps = Pick<User, "username">

type PageProps = {
    params: PostProps
}

interface UserDataProps {
    id: string
    avatarUrl: string | null
    email: string
    username: string
    fullName: string
    postsCount: number
    profile: Profile | null
    posts?: (Post & {
        author: User;
        tags: Tag[]
    })[]
}

/* SEO */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = params
    let userData: UserDataProps | null = null

    try {
        const userResponse = UserTask.getUser(username)
        userData = await userResponse
    } catch (err: any) {
        console.info(err.message)
        return notFound()
    }

    if (!userData) return { title: 'No user found!' }

    return {
        title: userData.fullName,
        description: `User info for ${userData.fullName}`
    }
}

export default async function UserProfile({ params }: PageProps) {

    const { username } = params
    let userData: UserDataProps | null = null

    try {
        const userResponse = UserTask.getUser(username)
        userData = await userResponse

    } catch (err: any) {
        console.info(err.message)
    }

    if (!userData) return notFound()

    return (
        <>
            <div className="relative flex justify-center items-center flex-col w-full sm:w-10/12 md:w-2/3 xl:w-3/6 mx-auto md:px-10 pt-10 mt-16 pb-4 bg-white dark:bg-[#344453] dark:text-slate-300 border-t sm:border dark:border-gray-600 sm:rounded-lg sm:shadow-md sm:shadow-slate-100 dark:shadow-none">
                <div className="w-full mb-4">
                    <Image
                        alt="User Avatar"
                        src={userData?.avatarUrl || DefaultAvatar.src}
                        width={112}
                        height={112}
                        className="absolute xs:relative w-20 h-20 xs:w-28 xs:h-28 ml-4 xs:mx-auto -mt-20 bg-white dark:bg-slate-400 border-2 md:border-4 border-indigo-200 dark:border-slate-400 p-[0.2rem] rounded-full object-cover object-center"
                        loading="eager"
                    />
                </div>

                <section className="w-full">
                    <div className="absolute flex flex-col md:flex-row items-center md:justify-start px-3 top-3 right-2">
                        {/* {<UserButton user={userData} currentUser={curUser} />} */}
                    </div>

                    <div className="flex flex-col xs:items-center p-4">
                        <div className="flex items-center gap-2 md:flex-col">
                            <h2 className="text-xl md:text-2xl font-semibold my-2">
                                {userData?.fullName}
                            </h2>
                        </div>
                        <p className="max-w-full break-words my-2">
                            {userData?.profile?.bio ? <span>{userData?.profile?.bio}</span> : <span>No bio found</span>}
                        </p>
                    </div>

                    <ul className="flex xs:justify-center flex-wrap gap-2 xs:gap-8 px-4 xs:p-0 text-sm md:text-base">
                        {
                            userData?.profile?.location && (
                                <li
                                    id="profile-posts-count"
                                    className="flex items-center justify-center my-1 ml-2 xs:ml-0"
                                >
                                    <div className="text-indigo-500 dark:text-blue-400 mr-1"><PinIcon /></div>
                                    <span>Location <b>{userData?.profile?.location}</b></span>
                                </li>
                            )
                        }
                        {userData?.profile?.website &&
                            <Link href={userData?.profile?.website}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center my-1 px-2 py-1 text-sm xs:text-base rounded-full hover:bg-gray-100 dark:hover:bg-slate-500"
                            >
                                <div className="text-indigo-500 dark:text-blue-400 mr-1"><GlobeIcon /></div>
                                <span className="font-medium mr-1">{displayWebsiteUri(userData?.profile?.website)}</span>
                            </Link>
                        }
                    </ul>
                </section>
            </div>

            <section className="flex xs:justify-center xs:items-center flex-col w-full sm:w-10/12 md:w-2/3 xl:w-3/6 mx-auto px-4 xs:px-10 py-2 sm:my-4 bg-white dark:bg-[#344453] text-gray-600 dark:text-slate-300 sm:rounded-lg border-b sm:border dark:border-gray-600 shadow-md dark:shadow-none shadow-slate-100">
                <p className="text-md md:text-lg font-semibold my-2">Recent activity</p>

                <ul className="flex xs:justify-center flex-wrap gap-x-8 md:p-2 text-sm md:text-base">
                    <li className="flex items-center justify-center my-1" id="profile-posts-count">
                        <div className="text-indigo-500 dark:text-blue-400 mr-1"><PostIcon /></div>
                        <span className='hidden xs:block'>Posts <b>{userData.postsCount}</b></span>
                        <span className='block xs:hidden'><b>{userData.postsCount}</b></span>
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

            <PostsList user={userData} />
        </>
    )
}
