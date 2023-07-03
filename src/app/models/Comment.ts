import { Post, User } from "@prisma/client";

export interface PostComment {
    id: string;
    author?: User;
    content: string;
    totalLikes: number;
    updatedAt?: Date;
    createdAt?: Date;
    authorId: string;
    postId: string;
    replyId?: string;
    post?: Post;
    replies?: PostComment[]
}
