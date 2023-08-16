import PostTask from '@/lib/posts'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {

    const { userId, postId } = await request.json()

    try {
        const bookmark = await PostTask.createBookmark(userId, postId)
        return NextResponse.json({ bookmark: bookmark }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}

export async function DELETE(request: Request) {

    const { userId, postId } = await request.json()

    try {
        const bookmark = await PostTask.deleteBookmark(userId, postId)
        return NextResponse.json({ bookmark: bookmark }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}