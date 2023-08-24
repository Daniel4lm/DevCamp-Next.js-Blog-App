"use client"

import Link from 'next/link'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { ConfirmIcon, SettingsIcon } from '@/components/Icons'

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
                <p className='w-full hidden md:block p-2 text-lg font-medium'>User settings</p>
                <hr className="w-full hidden md:block my-2 dark:border-gray-600" />
                <Link href={`/settings/account/${pathUsername}`} className="w-1/2 md:w-full">
                    <SidebarLinkTag
                        title="Edit Profile"
                        currentUriPath={currentUriPath}
                        menuLink={`/settings/account/${pathUsername}`}
                    >
                        <SettingsIcon />
                    </SidebarLinkTag>
                </Link>

                <Link href={`/settings/verify-email/${pathUsername}`} className="w-1/2 md:w-full">
                    <SidebarLinkTag
                        title="Reset Password"
                        currentUriPath={currentUriPath}
                        menuLink={`/settings/verify-email/${pathUsername}`}
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
        <li className={`flex items-center justify-between m-1 px-4 py-6 ${selectedLink(currentUriPath, menuLink)}`}>
            <span className="mr-2">{title}</span>
            {children}
        </li>
    )
}

const selectedLink = (currentUri: string, menuLink: string) => {
    if (currentUri === menuLink) {
        return 'max-h-12 rounded-full md:rounded-lg bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-200 text-gray-900 ease-in-out'
    } else {
        return 'max-h-12 rounded-full md:rounded-lg bg-gray-100 dark:bg-slate-500 hover:bg-indigo-100 hover:bg-indigo-200 dark:hover:bg-slate-500 ease-in-out'
    }
}

export default TabBar
