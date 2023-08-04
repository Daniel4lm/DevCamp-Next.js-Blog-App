"use client"

import Link from 'next/link'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { ConfirmIcon, SettingsIcon } from '@/app/components/Icons'

interface TabBarProps {
    styleClass: string
    currentUriPath: string
}

function TabBar({ styleClass, currentUriPath }: TabBarProps) {
    const pathname = usePathname()
    const pathUsername = pathname.split('/').filter(path => path !== '').at(-1)

    return (
        <div className={styleClass}>
            <ul className="flex flex-row items-center justify-center md:flex-col">
                <Link href={`/user/${pathUsername}/account/edit`} className="w-1/2 md:w-full">
                    <SidebarLinkTag
                        title="Edit Profile"
                        currentUriPath={currentUriPath}
                        menuLink={`/settings/account/${pathUsername}`}
                    >
                        <SettingsIcon />
                    </SidebarLinkTag>
                </Link>

                <Link href={`/user/${pathUsername}/account/password`} className="w-1/2 md:w-full">
                    <SidebarLinkTag
                        title="Change Password"
                        currentUriPath={currentUriPath}
                        menuLink={`/settings/password/${pathUsername}`}
                    >
                        <ConfirmIcon />
                    </SidebarLinkTag>
                </Link>
            </ul>
        </div>
    )
}

interface SidebarLinkTagProps {
    title: string
    currentUriPath: string
    menuLink: string
    children?: ReactNode
}

const SidebarLinkTag = ({ title, currentUriPath, menuLink, children }: SidebarLinkTagProps) => {
    return (
        <li className={`flex items-center justify-between m-1 p-4 ${selectedLink(currentUriPath, menuLink)}`}>
            <span className="mr-2">{title}</span>
            {children}
        </li>
    )
}

const selectedLink = (currentUri: string, menuLink: string) => {
    if (currentUri === menuLink) {
        return 'max-h-14 rounded-full md:rounded-lg bg-indigo-100 dark:bg-slate-400 text-gray-900 ease-in-out'
    } else {
        return 'max-h-14 rounded-full md:rounded-lg hover:bg-gray-100 dark:hover:bg-slate-500 ease-in-out'
    }
}

export default TabBar
