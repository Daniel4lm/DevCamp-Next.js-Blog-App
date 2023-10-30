import { $Enums } from "@prisma/client";
import { UserPost } from "./Post";

export interface ArticleBoardColumn {
    id?: string;
    description: string;
    title: string;
    type: $Enums.ArticleColumnType;
    color?: string | null;
    posts?: UserPost[]
}

export enum ArticleColumnType {
    TO_DO = 'TO_DO',
    IN_PROGRESS = 'IN_PROGRESS',
    IN_REVIEW = 'IN_REVIEW',
    COMPLETED = 'COMPLETED',
    PUBLISHED = 'PUBLISHED'
}