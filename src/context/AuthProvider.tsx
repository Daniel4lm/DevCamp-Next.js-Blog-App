"use client"

import { SessionProvider } from "next-auth/react"
import { ProviderType } from './types'

export const AuthProvider = ({ children }: ProviderType) => {

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    )
}
