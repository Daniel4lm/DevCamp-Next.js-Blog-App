export interface IObjectKeys {
    [key: string]: string | boolean
}

export interface LoginType {
    email?: string
    password?: string
    rememberMe: boolean
}

export interface SignupType {
    email?: string
    fullName?: string
    username?: string
    location?: string
    password?: string
}

interface UserInfoProps {
    id?: string
    email: string
    username: string
    fullName: string
    insertedAt?: string
    bio?: string
    location?: string
    avatarUrl?: string
    updatedAt?: string
    lastLogin?: string
    postsCount?: number
    website?: string
}

export interface LoginResponseProps {
    userInfo: UserInfoProps
    accessToken: string
}

export interface SignUpResponseProps {
    userInfo: UserInfoProps
    status: string
}
