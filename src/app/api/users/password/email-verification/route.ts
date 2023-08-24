import { sendConfirmationEmail } from "@/lib/mailer"
import UserTask from "@/lib/user"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {

    const { email } = await request.json()

    try {
        const user = await UserTask.getUser({ email: email })
        if (!user) return NextResponse.json({ error: 'User not found!' }, { status: 404 })

        const maybeActiveRequest = await UserTask.getActivePasswordResetStatus(user.id)
        if (maybeActiveRequest) return NextResponse.json({ message: "Email to reset password was already sent!" })

        const newResetToken = await UserTask.createResetPasswordToken(user.id)

        // send email
        const sendEmail = await sendConfirmationEmail(user.email, user.username, newResetToken.token)

        return NextResponse.json({ message: 'Please check your email to reset the password!' }, { status: 200 })
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 })
    }
}