import { Like } from "@prisma/client";
import { User } from "./User";
import { UserPost } from "./Post";

export interface PostComment {
    id: string
    author?: User
    content: string
    totalLikes: number
    updatedAt: Date
    createdAt: Date
    authorId: string
    postId: string
    replyId: string | null
    post?: UserPost
    replies?: PostComment[]
    likes?: Like[]
}
