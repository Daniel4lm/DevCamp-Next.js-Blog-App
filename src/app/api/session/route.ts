import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/authOptions'

export async function GET(request: NextRequest) {

    const session = await getServerSession(authOptions)

    return NextResponse.json({
        authenticated: !!session,
        session
    })
}