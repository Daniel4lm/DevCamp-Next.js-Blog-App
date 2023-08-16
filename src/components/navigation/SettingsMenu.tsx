"use client"

import { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import useOutsideClick from '@/hooks/useOutsideClick'
import { User } from '@/models/User'
import { AvatarIcon, CloseSideMenuIcon, LogoutIcon, SavedListIcon, SettingsIcon2, SmallUserIcon, TagListIcon, UserIcon } from '../Icons'
import SideMenu from './SideMenu'

enum MenuState {
    close = 'close',
    open = 'open'
}

export function SettingsMenu({ currentUser }: { currentUser: User }) {
    const [menuOpen, setMenuOpen] = useState<MenuState>(MenuState.close)
    const avatarRef = useRef(null)
    useOutsideClick(avatarRef, closeMenu)

    function handleMenuOpen() {
        setMenuOpen(menuOpen === MenuState.open ? MenuState.close : MenuState.open)
    }

    function closeMenu() {
        setMenuOpen(MenuState.close)
    }

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeMenu()
        }

        document.addEventListener('keydown', handleEscape)

        return () => document.removeEventListener('keydown', handleEscape)
    }, [])

    return (
        <>
            <li className="xs:relative mx-2" ref={menuOpen === MenuState.open ? avatarRef : null}>
                <div
                    id="user-avatar"
                    className="cursor-pointer flex items-center justify-center text-neutral-600 flex-col dark:text-gray-200 hover:text-black hover:underline"
                    onClick={handleMenuOpen}
                >
                    <UserAvatar src={currentUser?.avatarUrl || ''} className="w-8 h-8 md:w-9 md:h-9 ring-2 ring-slate-200 dark:ring-slate-500 hover:bg-gray-100 dark:hover:bg-slate-500 hover:ring-[#B1B8F8] hover:ring-opacity-80" />
                    {/* {<span className='hidden xs:block'>Me</span>} */}
                </div>

                <SideMenu
                    id='settings-menu'
                    classNames='w-full h-full shadow dark:text-white border-l border-slate-300 dark:border-slate-600 bg-white dark:dark:bg-menu-dark-github overflow-auto'
                    isOpen={menuOpen}
                    side='right'
                    closeFunc={closeMenu}
                >
                    <ul
                        id="settings-menu"
                        className={`absolute w-full p-2 bg-white dark:bg-menu-dark-github dark:text-slate-100 overflow-hidden text-sm`}
                    >
                        <li className="py-2 px-2 flex items-center justify-between">
                            <div className="flex items-center flex-1">
                                <UserAvatar
                                    withLink={`/user/${currentUser.username}`}
                                    src={currentUser?.avatarUrl || ''}
                                    className={"max-w-[2.1rem] max-h-[2.1rem] xs:max-w-[2.4rem] xs:max-h-[2.4rem] ring-2 ring-slate-200 dark:ring-slate-500 hover:bg-gray-100 dark:hover:bg-slate-500 hover:ring-[#B1B8F8] hover:ring-opacity-80"}
                                />
                                <div className="flex-1 ml-2">
                                    <p className="text-lg font-medium">{currentUser?.fullName}</p>
                                    <span>{currentUser?.email}</span>
                                </div>
                            </div>
                            <a
                                id="mobile-menu-close"
                                href="#"
                                className="z-50 dark:text-slate-200 hover:bg-[#e4e6fc] hover:dark:bg-slate-600 cursor-pointer rounded-lg p-2"
                                onClick={closeMenu}
                            >
                                <CloseSideMenuIcon />
                            </a>
                        </li>
                        <hr className="my-2 dark:border-gray-600" />
                        <Link href={`/user/${currentUser?.username}`} onClick={closeMenu}>
                            <li className="flex justify-start items-center gap-2 p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600">
                                <span className='text-slate-800 dark:text-inherit'>
                                    <SmallUserIcon />
                                </span>
                                <span>My profile</span>
                            </li>
                        </Link>

                        <Link href="/user/saved-list" onClick={closeMenu}>
                            <li className="flex justify-start items-center gap-2 p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600">
                                <span className='text-slate-800 dark:text-inherit'>
                                    {/* {<SavedListIcon classNames='w-4 h-4' />} */}
                                    <TagListIcon classNames='w-4 h-4'/>
                                </span>
                                <span>Saved list</span>
                            </li>
                        </Link>

                        <Link href={`/settings/account/${currentUser.username}`} onClick={closeMenu}>
                            <li className="flex justify-start items-center gap-2 p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600">
                                <span className='text-slate-800 dark:text-inherit'><SettingsIcon2 /></span>
                                <span>Settings</span>
                            </li>
                        </Link>

                        <hr className="my-2 dark:border-gray-600" />

                        <Link href={`/api/auth/signout`} onClick={closeMenu}>
                            <li className="flex justify-start items-center gap-2 p-2 cursor-pointer rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600">
                                <span className='text-slate-800 dark:text-inherit'><LogoutIcon /></span>
                                <span>Log Out</span>
                            </li>
                        </Link>
                    </ul >
                </SideMenu>
            </li>
        </>
    )
}

interface AvatarProps extends ComponentPropsWithoutRef<'img'> {
    withLink?: string
}

function UserAvatar({ withLink, ...props }: AvatarProps) {

    const renderIcon = () => {
        if (!props.src || props.src === 'undefined') {
            return <AvatarIcon styleClass={props.className} />
        } else {
            return <Image src={props.src} alt='User avatar' width={60} height={60} className={`rounded-full object-cover object-center bg-white dark:bg-slate-400 border border-gray-300 ${props.className}`} />
        }
    }

    return (
        <>
            {withLink
                ? (
                    <Link href={withLink}>
                        {renderIcon()}
                    </Link>
                )
                : (
                    <>
                        {renderIcon()}
                    </>
                )}
        </>
    )
}
