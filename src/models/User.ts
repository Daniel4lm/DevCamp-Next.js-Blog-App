import { PostComment } from "./Comment"
import { UserPost } from "./Post"

export interface User {
    id?: string | null
    avatarUrl: string | null
    username: string
    fullName: string
    email: string
    hashedPassword?: string | null | undefined
    insertedAt?: Date | null | undefined
    updatedAt?: Date | null | undefined
    postsCount: number
    role: 'USER' | 'ADMIN'
    profile?: Profile | null | undefined
    posts?: UserPost[] | null | undefined
    followersCount: number
    followingCount: number
    bookmarks?: []
    comments?: PostComment[]
    passwordUpdatedAt?: Date | null | undefined
    resetPasswordTokens?: []
    followings?: User[]
    followers?: User[]
}

export interface Profile {
    id: string
    userId: string | null
    bio: string | null
    password_updatedAt: Date | null
    lastLogin: Date | null
    themeMode: ThemeMode
    profileVisited: boolean
    kanbanColumnsReviewed?: string[]
    website: string | null
    location: string | null
    user: User
}

export enum ThemeMode {
    Light = 'LIGHT',
    Dark = 'DARK'
}
