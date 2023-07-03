import React, { ReactElement, ReactNode, cloneElement } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type SmartLinkProps = {
    href: string
    propClass?: string
    children?: ReactNode
}

type ChildrenProps = {
    className: string
}

export default function SmartLink({ href, propClass, children }: SmartLinkProps) {

    const pathName = usePathname();

    if (React.isValidElement(children)) {

        let className: string = children.props.className || '';

        if (pathName === href || (pathName.includes(href) && href.length > 1)) {
            className = `${className} active-link`;
        }

        return (
            <Link href={href} className={propClass}>
                {cloneElement(children as React.ReactElement<ChildrenProps>, { className })}
            </Link>
        );
    }

    return null;
}