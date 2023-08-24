"use client"

import { FeedArticle } from "@/components/posts-comments/CardsComponent"
import { UserPost } from "@/models/Post"
import { useEffect, useRef, useState } from "react"
import ScrollMarker from "./ScrollMarker"

interface ArticlesListProps {
    initialArticles: UserPost[]
    urlOptions: {
        page: number
        limit?: number
        term?: string | string[] | undefined,
        inf?: string | undefined
    },
    hasNexPage: boolean
}

function ArticlesList({ initialArticles, urlOptions, hasNexPage }: ArticlesListProps) {

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
                    <FeedArticle key={post.id} postData={post as UserPost} />
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

export default ArticlesList