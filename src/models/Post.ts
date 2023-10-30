import { Like, PostBookmark } from "@prisma/client";
import { User } from "./User";
import { PostComment } from "./Comment";
import { ArticleBoardColumn } from "./ArticleBoard";

export interface UserPost {
    id: string
    authorId: string
    columnId: string
    boardColumn?: ArticleBoardColumn
    title: string
    slug: string
    body: string
    photo_url: string | null
    published: boolean
    totalLikes: number
    totalComments: number
    totalBookmarks: number
    readTime: number
    author: User
    tags?: Tag[]
    comments?: PostComment[]
    likes?: Like[]
    bookmarks?: PostBookmark[]
    createdAt: Date
    updatedAt: Date
}

export interface Tag {
    id: string
    name: string
    posts?: UserPost[]
}
