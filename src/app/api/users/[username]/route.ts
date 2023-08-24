import { NextRequest, NextResponse } from 'next/server'
import UserTask from '@/lib/user'
import prisma from '@/lib/db/prismaClient'
import { maybeRemoveOldImage, maybeUploadImage } from '@/lib/fileHelpers'

export async function GET(request: NextRequest, { params }: { params: { username: string } }) {

    const username = params?.username

    try {
        const user = await UserTask.getUser({ username: username })

        if (!user) {
            return NextResponse.json({ error: 'User not found or username is invalid!' }, { status: 404 })
        }

        return NextResponse.json({ user: user }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function PUT(request: NextRequest) {

    try {
        const formData = await request.formData()
        let formEntries = Object.fromEntries(formData)

        const foundUser = await prisma.user.findUnique({
            where: { id: formEntries.id as string }
        })

        if (!foundUser) return NextResponse.json({ error: 'User not found or email is missing!' }, { status: 404 })

        let maybeParamsWithPhoto = formEntries

        const userAvatar = formData.get("avatarUrl") as Blob | null

        if (userAvatar && formEntries.avatarUrl !== 'undefined') {
            maybeParamsWithPhoto = await maybeUploadImage(
                formEntries,
                userAvatar,
                `/uploads/users/${formEntries.username}/`,
                {
                    paramToBeChanged: "avatarUrl",
                    customFileName: 'avatar-' + formEntries.username + '-' + userAvatar.name.toLowerCase().split(' ').join('-'),
                    isAvatar: true
                }
            )

            if (foundUser.avatarUrl && foundUser.avatarUrl !== 'undefined') {
                let pathArray = foundUser.avatarUrl.split('/')
                let oldImageName = pathArray.at(-1) || ''
                maybeRemoveOldImage(oldImageName, `public/uploads/users/${formEntries.username}/`)
            }
        }

        const updatedUser = await UserTask.updateUser(maybeParamsWithPhoto)

        return NextResponse.json({ updatedUser }, { status: 200 })
    } catch (err: any) {
        let error_response = {
            status: "error",
            message: err.message,
        }
        return new NextResponse(JSON.stringify(error_response), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        })
    }
}
