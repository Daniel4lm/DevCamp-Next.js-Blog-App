import { NextResponse } from 'next/server';
import UserTask from '@/lib/user';

export async function GET(request: Request, { params }: { params: { username: string } }) {

    console.log('User params: ', params)

    const username = params?.username

    try {
        const user = await UserTask.getUser(username)

        if (!user) {
            return NextResponse.json({ error: 'User not found or username is invalid!' }, { status: 404 })
        }

        return NextResponse.json({ user: user }, { status: 200 })

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}