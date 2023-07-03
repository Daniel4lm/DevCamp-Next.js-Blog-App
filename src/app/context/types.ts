import { ReactNode } from "react"

export interface ProviderType {
    children: ReactNode
}

export interface ThemeStateType {
    themeMode: string
    toggleMode: () => void
}