"use client"

import { CloseIcon, CloseSideMenuIcon } from "../Icons"

interface SideMenuProps {
    children?: React.ReactNode
    id: string
    title?: string
    side: 'left' | 'right'
    classNames: string
    isOpen: 'close' | 'open'
    closeFunc?: () => void
}

const leftShowClass = {
    open: 'visible translate-x-0',
    close: 'invisible -translate-x-full'
}

const rightShowClass = {
    open: 'visible translate-x-0',
    close: 'invisible translate-x-full'
}

const positionClass = {
    left: 'left-0 top-0 rounded-r-2xl',
    right: 'right-0 top-0 rounded-l-2xl'
}

function SideMenu(props: SideMenuProps) {

    // function hideMobileMenu() {
    //     props.closeFunc()
    // }

    return (
        <div
            id={`mobile-modal-window-${props.id}`}
            className={`${props.side === 'left' ? leftShowClass[props.isOpen] : rightShowClass[props.isOpen]} fixed ${positionClass[props.side]} z-80 w-11/12 xs:max-w-[299px] h-full transition-all duration-200 flex shadow-side-menu-shadow shadow-slate-400 dark:shadow-slate-800 opacity-100 bg-gray-400/80 dark:bg-gray-200/60 overflow-hidden fade-in`}
        >
            <div
                id="mobile-modal-content"
                className={`relative ${props.classNames} ${positionClass[props.side]}`}
            >
                {props.title ? <h4 className="text-xl font-semibold ml-6 my-3">{props.title}</h4> : null}
                {props.children}
            </div>
        </div>
    )
}

export default SideMenu
