"use client"

import Link from 'next/link'
// import { useAuthContext } from '../../context/authContext'
import { AppIcon, HambButton, HomeIcon, NewIcon } from '../Icons'
import { ThemeToggle } from '../ThemeToggle'
import { SettingsItem } from './SettingsMenu'
import { useState } from 'react'
import SmartLink from './SmartLink'
import ToolTip from '../Tooltip'

interface NavBarProps {
    title?: string
}

export default function Navbar({ title }: NavBarProps) {
    //   const { pathname } = useLocation()
    //   const { state } = useAuthContext()
    const [currentUser, SetCurrentUser] = useState(true)

    return (
        <header id="app-navbar" className="h-16 border-b dark:border-transparent flex fixed top-0 w-full bg-white dark:bg-navbar-dark dark:text-slate-100 z-50">
            <div className="flex justify-between lg:justify-center items-center px-2 py-0 mx-auto w-full md:w-11/12 2xl:w-8/12">
                <div className="flex justify-center items-center gap-2 xs:gap-0">
                    <div
                        id="toggle-modile-menu"
                        className="block xs:hidden hover:bg-gray-200 hover:dark:bg-slate-500 cursor-pointer rounded-lg p-2"
                    >
                        {/* onClick={showMobileMenu} */}
                        <HambButton />
                    </div>
                    <Link href="/" className="flex items-center gap-2 md:mx-4">
                        <AppIcon />
                        <h4 className="text-lg md:text-xl font-normal">{title}</h4>
                    </Link>

                </div>

                <nav className="lg:w-3/5">
                    <ul className="flex items-center justify-end pl-2 text-xs">
                        {currentUser
                            ? (
                                <>
                                    <SmartLink href="/" propClass='rounded-md hover:bg-gray-100 dark:hover:bg-slate-500'>
                                        <li id="home-icon" className="hidden px-2 py-1 xs:flex flex-col items-center justify-center text-gray-600 dark:text-gray-200 hover:text-black">
                                            <HomeIcon />
                                            <span>Home</span>
                                        </li>
                                    </SmartLink>

                                    <SmartLink href="/posts/new" propClass="ml-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-500">
                                        <li id="new-post" className="hidden px-2 py-1 xs:flex flex-col items-center justify-center text-gray-600 dark:text-gray-200 hover:text-black">
                                            <NewIcon />
                                            <span className="hidden lg:block">New post</span>
                                            <span className="lg:hidden">Post</span>
                                        </li>
                                    </SmartLink>

                                    {/* <NotificationsComponent
                                        id="notifications-comp"
                                        current_user={@current_user}
                                        /> */}
                                    {/* <SettingsMenu current_user={@current_user} active_path={@active_path} /> */}
                                    <SettingsItem />
                                </>
                            )
                            : (
                                <>
                                    <li className="hidden xs:block">
                                        <Link href="auth/login" className="ml-2 py-[0.4rem] px-3 text-gray-700 rounded-full font-medium duration-150 ease-in-out bg-transparent border dark:border-none hover:bg-gray-200 dark:hover:bg-slate-500 dark:text-slate-100">
                                            Log In
                                        </Link>
                                    </li>
                                    <li className="hidden xs:block">
                                        <Link href="auth/signup" className="ml-2 py-[0.4rem] px-3 text-gray-700 rounded-full font-medium duration-150 ease-in-out bg-transparent border dark:border-none hover:bg-gray-200 dark:hover:bg-slate-500 dark:text-slate-100">
                                            Sign Up
                                        </Link>
                                    </li >
                                </>
                            )}
                        <ToolTip position="bottom" title="Day/Night Theme">
                            <li
                                id="theme-switch"
                                className="relative mx-4 text-gray-600 dark:text-gray-200 hover:text-indigo-400"
                            >
                                <ThemeToggle />
                            </li>
                        </ToolTip>
                    </ul >
                </nav >
            </div >
        </header >
    )
}
