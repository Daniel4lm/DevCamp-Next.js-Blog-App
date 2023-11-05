import { notFound } from "next/navigation"
import { Metadata } from "next"
import UserTask from "@/lib/user"
import PostsList from "./components/PostsList"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import UserInfo from "./components/UserInfo"
import getQueryClient from "@/lib/reactQuery/getQueryClient"
import { Hydrate, dehydrate } from "@tanstack/react-query"
import { User } from "@/models/User"
import StarredList from "./components/StarredList"

type PostProps = Pick<User, "username">

type PageProps = {
    params: PostProps,
    searchParams: {
        tab: string | undefined
    }
}

/* SEO */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = params
    let userData: User | null = null

    try {
        const userResponse = UserTask.getUser({ username: username })
        userData = await userResponse as User
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

export default async function UserProfile({ params, searchParams }: PageProps) {
    const { username } = params
    const session = await getServerSession(authOptions)
    let userData: User | null = null

    const tabSection = searchParams?.tab || 'all'

    const queryClient = getQueryClient()

    try {
        userData = await UserTask.getUser({ username: username }) as User

        await queryClient.prefetchQuery({
            queryKey: ['user', username],
            queryFn: async function () {
                const userFetch = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${username}`)
                const userJson = await userFetch.json()
                return userJson.user as User
            },
        })
    } catch (err: any) {
        console.info(err.message)
    }

    if (!tabSection || !userData) return notFound()

    const dehydratedState = dehydrate(queryClient)

    function renderSections(userData: User) {
        switch (tabSection) {
            case 'all':
                return (<PostsList user={userData} />)
            case 'starred':
                return (<StarredList currentUser={session?.user} user={userData} section={tabSection} />)
            default:
                return null
        }
    }

    return (
        <Hydrate state={dehydratedState}>
            <div>
                <UserInfo currentUser={session?.user} user={userData} />
                {
                    renderSections(userData)
                }

            </div>
        </Hydrate>
    )
}
