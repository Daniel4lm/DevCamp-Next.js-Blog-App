
import Link from 'next/link'
import { AppIcon, HambButton, HomeIcon, HomeIconFill, NewIcon, NewIconFill } from '../Icons'
import { ThemeToggle } from '../ThemeToggle'
import { SettingsMenu } from './SettingsMenu'
import { User } from '@/models/User'
import SmartLink from './SmartLink'
import ToolTip from '../Tooltip'
import WorkMenu from './WorkMenu'

interface NavBarProps {
    title?: string
    currentUser?: User | undefined
}

export default function Navbar({ title, currentUser }: NavBarProps) {

    return (
        <header id="app-navbar" className="h-16 border-b dark:border-transparent flex fixed top-0 w-full bg-white dark:bg-navbar-dark dark:text-slate-100 z-50">
            <div className="flex justify-between items-center px-2 py-0 mx-auto w-full md:w-11/12"> {/* 2xl:w-8/12 */}
                <div className="flex justify-center items-center gap-2 xs:gap-0">
                    
                    <Link href="/" className="flex items-center gap-2 mx-4">
                        <AppIcon />
                        <h4 className="text-lg md:text-xl font-normal">{title}</h4>
                    </Link>
                </div>

                <nav className="lg:w-3/5">
                    <ul className="flex items-center justify-end pl-2 text-xs md:text-base">
                        {currentUser
                            ? (
                                <>
                                    <WorkMenu />

                                    {/* <NotificationsComponent
                                        id="notifications-comp"
                                        current_user={@current_user}
                                        /> */}
                                    <SettingsMenu currentUser={currentUser as User} />
                                </>
                            )
                            : (
                                <>
                                    <li className="hidden xs:block">
                                        <Link href="/api/auth/signin" className="ml-2 py-[0.4rem] px-3 text-gray-700 rounded-full font-medium duration-150 ease-in-out bg-transparent border dark:border-none hover:bg-gray-200 dark:hover:bg-slate-500 dark:text-slate-100">
                                            Log In
                                        </Link>
                                    </li>
                                    <li className="hidden xs:block">
                                        <Link href="/auth/register" className="ml-2 py-[0.4rem] px-3 text-gray-700 rounded-full font-medium duration-150 ease-in-out bg-transparent border dark:border-none hover:bg-gray-200 dark:hover:bg-slate-500 dark:text-slate-100">
                                            Sign Up
                                        </Link>
                                    </li>
                                </>
                            )}
                        <ToolTip position="bottom" title="Day/Night Theme">
                            <li
                                id="theme-switch"
                                className="relative mx-2 xs:mx-4 text-gray-600 dark:text-gray-200 hover:text-indigo-400"
                            >
                                <ThemeToggle />
                            </li>
                        </ToolTip>
                    </ul>
                </nav>
            </div>
        </header>
    )
}
