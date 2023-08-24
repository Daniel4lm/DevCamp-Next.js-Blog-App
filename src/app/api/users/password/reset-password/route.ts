import { encryptPassword } from "@/lib/helperFunctions";
import UserTask from "@/lib/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {

    const { email, password, token } = await request.json()

    try {
        const user = await UserTask.getUser({
            AND: [
                { email: email },
                {
                    resetPasswordTokens: {
                        some: {
                            AND: [
                                {
                                    resetedAt: null,
                                },
                                {
                                    createdAt: {
                                        gt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
                                    },
                                },
                                {
                                    token: token
                                },
                            ],
                        },
                    }
                }
            ]
        })

        if (!user) return NextResponse.json({ error: 'Token is invalid or expired!' }, { status: 404 })

        let encryptedPassword = encryptPassword(password)
        const userWithNewPass = await UserTask.resetUserPassword(encryptedPassword, token)

        return NextResponse.json({ message: 'Your password has been succesfuly changed! Please Sign In again or click the button bellow.' }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}
