import { useEffect, useRef, useState } from "react"

type UseTocObserverType = {
    selector?: string
}

function useTocObserver({ selector }: UseTocObserverType) {

    const [activeId, setActiveId] = useState<string | null>(null);
    let intersObserver = useRef<IntersectionObserver | null>()

    useEffect(() => {

        intersObserver.current = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry?.isIntersecting) {
                    setActiveId(entry.target.id)
                }
            })
        },
            {
                rootMargin: "0px 0px -80% 0px"
            })

        const contentElements: NodeListOf<HTMLAnchorElement> = document.querySelectorAll(selector || 'h2,h3,h4,h5,h6')
        contentElements.forEach((elem) => intersObserver.current?.observe(elem))

        return () => intersObserver.current?.disconnect()
    }, []);


    return {
        activeId
    }
}

export default useTocObserver
