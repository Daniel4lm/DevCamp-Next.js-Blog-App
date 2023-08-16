"use client"

import React, { PropsWithChildren, cloneElement } from "react"
import { usePathname } from "next/navigation"
import Link, { LinkProps } from "next/link"

type SmartLinkProps = {
    isScrollAble?: boolean
}

type ChildrenProps = {
    className: string
}

export default function SmartLink({ href, children, isScrollAble = false, ...props }: SmartLinkProps & LinkProps & PropsWithChildren) {

    const pathName = usePathname()
    const linkPathname = typeof href === 'object' ? href.pathname : href
    const linkQuery = typeof href === "object" && typeof href.query === "object" ? href.query : {}

    if (React.isValidElement(children)) {

        let className: string = children.props.className || ''

        if (pathName === href || (pathName.includes(linkPathname as string) && linkPathname!.length > 1)) {
            className = `${className} active-link`
        }

        const scrollToElement = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
            if (isScrollAble) {
                e.preventDefault()
                const elemId = linkPathname?.replace(/.*\#/, "")
                const scrollSection = document.getElementById(elemId || '')
                scrollSection && window.scrollTo({ behavior: 'smooth', top: scrollSection?.getBoundingClientRect().top })
            }
        }

        return (
            <Link
                href={{
                    pathname: linkPathname,
                    query: { ...linkQuery }
                }}
                onClick={isScrollAble ? (e) => scrollToElement(e) : props.onClick}
            >
                {cloneElement(children as React.ReactElement<ChildrenProps>, { className })}
            </Link>
        )
    }

    return null
}