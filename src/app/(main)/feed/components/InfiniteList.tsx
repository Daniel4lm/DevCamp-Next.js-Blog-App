"use client"

import { UserPost } from "@/models/Post"
import { useEffect, useRef, useState } from "react"
import ScrollMarker from "./ScrollMarker"
import FeedArticleCard from "@/components/posts-comments/FeedCard"

interface InfiniteListProps {
    initialArticles: UserPost[]
    urlOptions: {
        page: number
        limit?: number
        term?: string | string[] | undefined,
        inf?: string | undefined
    },
    hasNexPage: boolean
}

function InfiniteList({ initialArticles, urlOptions, hasNexPage }: InfiniteListProps) {

    const [articles, setAticles] = useState<UserPost[]>([])
    const initialRender = useRef(true)

    useEffect(() => {
        if (initialRender.current) {
            initialRender.current = false
            return
        }

        let maybeResetArticles = urlOptions.page === 1 && articles.length > 0 ? [] : articles

        setAticles(prevArticles => [...maybeResetArticles, ...initialArticles])
    }, [initialArticles])

    return (
        <>
            <div
                role='list'
                className={`grid px-2 grid-cols-1 gap-x-4 gap-y-8 ${articles.length > 1 ? ' sm:grid-cols-2 sm:gap-x-6 md:grid-cols-3 xl:gap-x-8' : 'w-full sm:max-w-[240px] mx-auto'}`}
            >
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
            </div>

            {articles.length ? (
                <ScrollMarker
                    urlOptions={urlOptions}
                    hasNexPage={hasNexPage}
                />) : null}
        </>
    )
}

export default InfiniteList
