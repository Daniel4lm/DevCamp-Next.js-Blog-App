import { Metadata } from "next"
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
        title: 'User Account page',
        description: `Settings page for user ${userData.fullName}`
    }
}

export default async function PostFormPage({ params }: PageProps) {

    return (
        <div>
            <p>User password change</p>
        </div>
    )
}