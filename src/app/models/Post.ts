import { User } from "./User";

export interface Post {
    id: string
    title: string
    slug: string
    body: string
    photo_url?: string
    published: boolean
    totalLikes: number
    totalComments: number
    readTime: number
    authorId: string
    author: User
    tags?: Tag[]
    createdAt: Date
    updatedAt: Date
}

export interface Tag {
    id: string
    name: string
    posts: Post[]
}
