"use client"

import useOutsideClick from "@/app/hooks/useOutsideClick"
import { useEffect, useRef, useState } from "react"
import { AppIcon, CloseSideMenuIcon, HomeIcon, NewIcon, NewIconFill, NewPostIcon, WorkMenuIcon } from "../Icons"
import SideMenu from "./SideMenu"
import SmartLink from "./SmartLink"

enum MenuState {
    close = 'close',
    open = 'open'
}

function WorkMenu() {

    const [menuOpen, setMenuOpen] = useState<MenuState>(MenuState.close)
    const menuRef = useRef(null)

    const closeMenu = () => setMenuOpen(MenuState.close)

    useOutsideClick(menuRef, closeMenu)

    const handleMenuOpen = () => setMenuOpen(menuOpen === MenuState.open ? MenuState.close : MenuState.open)

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeMenu()
        }

        document.addEventListener('keydown', handleEscape)

        return () => document.removeEventListener('keydown', handleEscape)
    }, [])

    return (
        <>
            <li
                ref={menuOpen === MenuState.open ? menuRef : null}
                className="xs:relative mx-2 px-2 py-1 text-xs md:text-sm flex flex-col items-center justify-center"
            >
                <div
                    className="cursor-pointer flex flex-col items-center justify-center text-[#755FFF] dark:text-gray-200 hover:text-black hover:underline"
                    onClick={handleMenuOpen}
                >
                    <WorkMenuIcon />
                    <span className='hidden xs:block'>My work</span>
                </div>

                <SideMenu
                    id="work-menu"
                    classNames='w-full h-full shadow dark:text-white border-l border-slate-300 dark:border-slate-600 bg-white dark:dark:bg-menu-dark-github overflow-auto'
                    isOpen={menuOpen}
                    side='right'
                    closeFunc={closeMenu}
                >
                    <ul
                        id="work-menu"
                        className={`absolute w-full p-2 bg-white dark:bg-menu-dark-github dark:text-slate-100 overflow-hidden text-sm`}
                    >
                        <li className="py-2 px-4 flex items-center justify-between">
                            <div className="flex items-center flex-1">
                                <AppIcon />
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
                        <SmartLink href="/" onClick={closeMenu}>
                            <li id="home-icon" className="px-4 py-2 flex items-center gap-2 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600 hover:text-black text-gray-800 dark:text-gray-200">
                                <HomeIcon />
                                <span>Home</span>
                            </li>
                        </SmartLink>
                        <SmartLink href="/posts/new" onClick={closeMenu}>
                            <li id="new-post" className="px-4 py-2 flex items-center gap-2 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600 hover:text-black text-gray-800 dark:text-gray-200">
                                <NewPostIcon />
                                <span className="hidden xs:block">New post</span>
                                <span className="xs:hidden">Post</span>
                            </li>
                        </SmartLink>
                        <hr className="my-2 dark:border-gray-600" />
                    </ul>
                </SideMenu>
            </li>
        </>
    )
}

export default WorkMenu
