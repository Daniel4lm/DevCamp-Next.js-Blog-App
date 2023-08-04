import React from 'react'

function ForgotPasswordPage({ params }: {
    params: {
        token: string,
        email: string
    }
}) {

    const { email, token } = params

    return (
        <div>
            <p>{token}</p>
            <p>{email}</p>
        </div>
    )
}

export default ForgotPasswordPage
