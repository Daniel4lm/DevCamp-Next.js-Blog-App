import { NextResponse } from 'next/server';
import PostTask from '@/lib/posts';

export async function GET(request: Request, { params }: { params: { slug: string } }) {

    console.log('Params: ', params)
    const postSlug = params?.slug

    try {
        const post = await PostTask.getPostBySlug(postSlug)
        if (!post) {
            return NextResponse.json({ error: 'Blog post not found or data is invalid!' }, { status: 404 })
        }
        return NextResponse.json({ post: post }, { status: 200 })

    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}