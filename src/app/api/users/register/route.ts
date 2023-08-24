import { NextRequest, NextResponse } from 'next/server'
import UserTask from '@/lib/user'
import { encryptPassword } from '@/lib/helperFunctions'

export async function POST(request: NextRequest) {
    const { username, fullName, email, password } = await request.json()

    try {
        const maybeDuplicate = await UserTask.getUser({ username: username })
        if (maybeDuplicate) return NextResponse.json({ message: 'User already exists!' }, { status: 409 })

        let encryptedPassword = encryptPassword(password)

        const newUser = await UserTask.createNewUser({
            email: email,
            fullName: fullName,
            hashedPassword: encryptedPassword,
            username: username
        })

        const userInfo = { email: newUser.email, username: newUser.username, fullName: newUser.fullName }

        return NextResponse.json({ user: userInfo }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
