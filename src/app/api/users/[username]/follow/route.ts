
import { getServerSession } from 'next-auth'
import { authOptions } from '../../../auth/[...nextauth]/authOptions'
import UserTask from '@/lib/user'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {

    const url = new URL(request.url)
    const username = url.searchParams.get("username") || ''

    if (!username) return NextResponse.json({ error: "Username not provided!" }, { status: 404 })

    try {
        const followers = await UserTask.getFollowers(username)
        const followings = await UserTask.getFollowing(username)

        return NextResponse.json({ followers: followers, followings: followings }, { status: 200 })

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function POST(request: Request) {

    const { username } = await request.json()

    const session = await getServerSession(authOptions)
    const followerId = session?.user.id || ''

    try {
        const user = await UserTask.getUser(username)
        const userId = user?.id || ''

        const followedRecord = UserTask.createUserFollower(followerId, userId)
        return NextResponse.json({ followedRecord: followedRecord }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {

    const { username } = await request.json()

    const session = await getServerSession(authOptions)
    const followerId = session?.user.id || ''

    try {
        const user = await UserTask.getUser(username)
        const userId = user?.id || ''

        const unfollowedRecord = UserTask.unfollowUser(followerId, userId)
        return NextResponse.json({ unfollowedRecord: unfollowedRecord }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
