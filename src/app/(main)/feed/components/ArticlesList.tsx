"use client"

import FeedArticleCard from "@/components/posts-comments/FeedCard";
import { UserPost } from "@/models/Post";

interface ArticlesListProps {
    articles: UserPost[]
}

function ArticlesList({ articles }: ArticlesListProps) {
    return (
        <>
            {articles?.map(post => (
                <FeedArticleCard key={post.id}>
                    <FeedArticleCard.CardLink href={`/posts/post/${post?.slug}`} />
                    <FeedArticleCard.CardImage photoUrl={post.photo_url} title={post.title} />
                    <FeedArticleCard.CardBody>
                        <FeedArticleCard.Combine>
                            <FeedArticleCard.ArticleDate updatedAt={post.updatedAt} />
                            <FeedArticleCard.Title>{post.title}</FeedArticleCard.Title>
                        </FeedArticleCard.Combine>
                        <FeedArticleCard.UserInfo author={post.author} />
                    </FeedArticleCard.CardBody>
                </FeedArticleCard>
            ))}
        </>
    )
}

export default ArticlesList
