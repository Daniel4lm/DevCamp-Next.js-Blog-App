"use client"

import { useCallback } from "react"
import { useRouter } from "next/navigation"
import { mergeUrlParams } from "@/lib/helperFunctions"

interface ScrollMarkerProps {
    urlOptions: {
        page?: number
        limit?: number
        term?: string | string[] | undefined,
        inf?: string | undefined
    },
    hasNexPage: boolean
}

function ScrollMarker({ urlOptions, hasNexPage }: ScrollMarkerProps) {

    const router = useRouter()
    const markerRef = useCallback((marker: HTMLDivElement) => {

        if (!marker) return

        let intersObserver = new IntersectionObserver((entries) => {
            const target = entries[0]
            if (target.isIntersecting && hasNexPage) {
                const urlParams = mergeUrlParams({
                    ...urlOptions,
                    page: (urlOptions?.page || 1) + 1
                    //limit: (urlOptions?.limit || 6) + 6,
                })
                router.push(`/feed?${urlParams}`, { scroll: false })
                intersObserver.disconnect()
            }
        },
            {
                root: null,
                threshold: 1.0,
            })

        intersObserver.observe(marker)
    }, [urlOptions, hasNexPage, router])

    return (
        <div id="infinite-scroll-marker" ref={markerRef} className="h-1"></div>
    )
}

export default ScrollMarker
