import { Post } from "./Post"

export interface User {
    id?: string | null
    avatarUrl?: string | null
    username: string
    fullName: string
    email: string
    hashedPassword?: string | null
    insertedAt?: string | null
    updatedAt?: string | null
    postsCount?: number | null
    role: 'user' | 'admin'
    refreshToken?: string | null
    profile?: Profile | null
    posts?: Post[] | null
}

export interface Profile {
    id: string
    bio?: string | null
    userId: string | null
    password_updatedAt?: string | null
    lastLogin?: string | null
    themeMode: ThemeMode
    website?: string | null
    location?: string | null
    user: User
}

export enum ThemeMode {
    Light = 'LIGHT',
    Dark = 'DARK'
}
