import { useEffect, useRef, useState } from "react"

type UseTocDataReturnType = {
    articleHeadings: ArticleHeadingProps[]
}

interface ArticleHeadingProps {
    id: string,
    href: string,
    title: string
}

type UseTocProps = {
    selector?: string
}

function useTocData({ selector }: UseTocProps): UseTocDataReturnType {
    const [articleHeadings, setArticleHeadings] = useState<ArticleHeadingProps[]>([])
    const effectRun = useRef(false)

    useEffect(() => {
        if (!effectRun.current) {
            const contentElements: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(selector || 'h2,h3,h4,h5,h6');

            const filteredNavLinks = Array.from(contentElements).map((element) => {
                const slugName = element.textContent?.trim()
                    .toLowerCase()
                    .split(/[,\s'\/]/)
                    .join('-')

                return {
                    id: slugName || '',
                    href: '#' + slugName,
                    title: element.textContent?.trim() || ''
                }
            })

            setArticleHeadings(filteredNavLinks)
        }

        return () => {
            effectRun.current = true
        }
    }, []);

    return { articleHeadings }
}

export default useTocData