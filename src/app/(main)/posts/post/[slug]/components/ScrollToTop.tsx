"use client"

import { ScrollToTopIcon } from "@/app/components/Icons"
import { useEffect } from "react"

const ScrollToTopButton = () => {

    const scrollToTop = () => {
        window.scroll({
            top: 0,
            left: 0,
            behavior: 'smooth'
        })
    }

    useEffect(() => {

        const scrollToTopButton = document.getElementById('scroll-to-top')

        function handlePageScroll() {
            if (window.scrollY > 400) {
                scrollToTopButton?.classList.replace('opacity-0', 'opacity-1')
                scrollToTopButton?.classList.replace('translate-y-1/2', '-translate-y-1/2')
            } else {
                scrollToTopButton?.classList.replace('opacity-1', 'opacity-0')
                scrollToTopButton?.classList.replace('-translate-y-1/2', 'translate-y-1/2')
            }
        }

        handlePageScroll()

        scrollToTopButton && window.addEventListener('scroll', handlePageScroll)
        return () => window.removeEventListener('scroll', handlePageScroll)
    }, [])

    return (
        <div
            id="scroll-to-top"
            className="fixed duration-200 ease-in-out z-50 opacity-0 rounded-full flex items-center cursor-pointer bottom-0 -translate-y-5 xl:-translate-y-10 right-2 xs:right-5 xl:right-10"
            onClick={scrollToTop}
        >
            <ScrollToTopIcon />
        </div>
    )
}

export default ScrollToTopButton