import { notFound } from "next/navigation"
import { Metadata } from "next"
import { Post, Profile, Tag, User } from "@prisma/client"
import UserTask from "@/lib/user"
import PostsList from "./components/PostsList"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import UserInfo from "./components/UserInfo"
import getQueryClient from "@/lib/reactQuery/getQueryClient"
import { Hydrate, dehydrate } from "@tanstack/react-query"

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
    role: "user" | "admin"
    profile: Profile | null
    posts?: (Post & {
        author: User;
        tags: Tag[]
    })[],
    followersCount: number
    followingCount: number
}

/* SEO */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = params
    let userData: UserDataProps | null = null

    try {
        const userResponse = UserTask.getUser(username)
        userData = await userResponse as UserDataProps
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
    const session = await getServerSession(authOptions)
    let userData: UserDataProps | null = null
    // let userFollow: UserFollowingProps | null = null

    const queryClient = getQueryClient()

    try {
        userData = await UserTask.getUser(username) as UserDataProps
        // userFollow = await UserTask.getUserFollowing(session?.user.id || '', userData?.id || '')

        await queryClient.prefetchQuery({
            queryKey: ['user', username],
            queryFn: async function () {
                const userFetch = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${username}`)
                const userJson = await userFetch.json()
                return userJson.user
            },
        })
    } catch (err: any) {
        console.info(err.message)
    }

    if (!userData) return notFound()

    const dehydratedState = dehydrate(queryClient)

    return (
        <Hydrate state={dehydratedState}>
            <div>
                <UserInfo currentUser={session?.user} user={userData} />
                <PostsList user={userData} />
            </div>
        </Hydrate>
    )
}
