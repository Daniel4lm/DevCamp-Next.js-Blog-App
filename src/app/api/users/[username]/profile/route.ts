import UserTask from '@/lib/user'
import prisma from '@/lib/db/prismaClient'
import { NextRequest, NextResponse } from 'next/server'

export async function PUT(request: NextRequest) {
    try {
        const formData = await request.formData()
        let formEntries = Object.fromEntries(formData)
        const { id, ...params } = formEntries
        const profileVisited: boolean | undefined = params.profileVisited && params.profileVisited === 'true' ? true : false
        const kanbanColumnsReviewed: string[] | undefined = params.kanbanColumnsReviewed && JSON.parse(params.kanbanColumnsReviewed as string)

        const foundUser = await prisma.user.findUnique({
            where: { id: id as string },
            include: { profile: true }
        })

        if (!foundUser) return NextResponse.json({ error: 'User not found or some data is missing!' }, { status: 404 })

        let arr = [...new Set([...foundUser.profile?.kanbanColumnsReviewed || [], ...kanbanColumnsReviewed || []])]

        let updatedParams =
            profileVisited ? { ...params, profileVisited: profileVisited } :
                kanbanColumnsReviewed ? { ...params, kanbanColumnsReviewed: arr } : params

        const updatedProfile = await UserTask.updateProfile(id as string, updatedParams)

        return NextResponse.json({ updatedProfile }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}