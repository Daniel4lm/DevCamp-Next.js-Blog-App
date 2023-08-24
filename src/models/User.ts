import { UserPost } from "./Post"

export interface User {
    id?: string | null
    avatarUrl: string | null
    username: string
    fullName: string
    email: string
    hashedPassword?: string | null
    insertedAt?: Date | null
    updatedAt?: Date | null
    postsCount: number
    role: 'USER' | 'ADMIN'
    refreshToken?: string | null
    profile?: Profile | null
    posts?: UserPost[] | null
    followersCount: number
    followingCount: number
}

export interface Profile {
    id: string
    userId: string | null
    bio: string | null
    password_updatedAt: Date | null
    lastLogin: Date | null
    themeMode: ThemeMode
    website: string | null
    location: string | null
    user: User 
}

export enum ThemeMode {
    Light = 'LIGHT',
    Dark = 'DARK'
}
