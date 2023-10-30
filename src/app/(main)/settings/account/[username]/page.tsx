import { Metadata } from "next"
import AccountForm from "./AccountForm"
import { Post, Profile, Tag, User } from "@prisma/client"
import { notFound } from "next/navigation"
import UserTask from "@/lib/user"

type PageProps = {
    params: {
        username: string
    }
}

interface UserDataProps {
    id: string
    avatarUrl: string | null
    email: string
    username: string
    fullName: string
    postsCount: number
    role: string
    profile: Profile | null
    posts?: (Post & {
        author: User;
        tags: Tag[]
    })[]
}

/* SEO */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = params
    let userData: UserDataProps | null | undefined = null

    try {
        const userResponse = UserTask.getUser({ username: username })
        userData = await userResponse
    } catch (err: any) {
        console.info(err.message)
        return notFound()
    }

    if (!userData) return { title: 'No user found!' }

    return {
        title: 'User Account page',
        description: `Settings page for user ${userData.fullName}`
    }
}

export default async function PostFormPage({ params }: PageProps) {

    const { username } = params
    let userData: { [x: string]: string } | null | undefined = null

    try {
        const userResponse = await UserTask.getUser({ username: username })
        userData = userResponse && {
            id: userResponse.id,
            email: userResponse?.email,
            fullName: userResponse?.fullName,
            username: userResponse?.username,
            location: userResponse?.profile?.location || '',
            website: userResponse?.profile?.website || '',
            bio: userResponse?.profile?.bio || '',
            siteTheme: userResponse?.profile?.themeMode || 'LIGHT',
            fontName: userResponse.profile?.fontName || 'font-default',
            avatarUrl: userResponse?.avatarUrl || ''
        }

    } catch (err: any) {
        console.info(err.message)
    }

    if (!userData) return notFound()

    return (
        <>
            <AccountForm userData={userData} />
        </>
    )
}