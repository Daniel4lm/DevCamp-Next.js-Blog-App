import { ComponentPropsWithoutRef, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
// import { useAuthContext } from '../../context/authContext'
// import useLogout from '../../hooks/useLogout'
import useOutsideClick from '@/hooks/useOutsideClick'
import defaultAvatar from '../../../../public/defaultAvatar.png'
import Image from 'next/image'

const menuShowClass = {
    open: 'animate-[show-up-menu_0.2s_ease-in-out_forwards]',
    close: 'animate-[hide-menu_0.2s_ease-in-out_forwards]'
}

enum MenuState {
    close = 'close',
    open = 'open'
}

export function SettingsItem() {
    const [menuOpen, setMenuOpen] = useState<MenuState>(MenuState.close)
    //   const { state: { currentUser } } = useAuthContext()
    const [currentUser, SetCurrentUser] = useState({
        email: 'daniel4molnar',
        fullName: 'Daniel Molnar',
        userName: 'daniel4mx',
        avatarUrl: null
    })
    const avatarRef = useRef(null)
    useOutsideClick(avatarRef, closeMenu)

    function handleMenuOpen() {
        setMenuOpen(menuOpen === MenuState.open ? MenuState.close : MenuState.open)
    }

    function closeMenu() {
        setMenuOpen(MenuState.close)
    }

    return (
        <>
            <li className="xs:relative ml-4" ref={menuOpen === MenuState.open ? avatarRef : null}>
                <div
                    id="user-avatar"
                    className="cursor-pointer flex items-center justify-center text-gray-600 flex-col dark:text-gray-200 hover:text-black"
                    onClick={handleMenuOpen}
                >
                    <UserAvatar src={currentUser?.avatarUrl || defaultAvatar.src} className="w-7 h-7 lg:w-8 lg:h-8 hover:border-indigo-300 hover:ring-2 dark:hover:ring-0 hover:ring-indigo-300 hover:ring-opacity-80" />
                    <span className='hidden xs:block'>Me</span>
                </div>
                {menuOpen === 'open' && <SettingsMenu isOpen={menuOpen} closeFunc={closeMenu} />}
            </li >
        </>
    )
}

function SettingsMenu({ isOpen, closeFunc }: { isOpen: MenuState, closeFunc: () => void }) {
    // const { state: { currentUser } } = useAuthContext()
    const [currentUser, SetCurrentUser] = useState({
        email: 'daniel4molnar',
        fullName: 'Daniel Molnar',
        userName: 'daniel4mx',
        avatarUrl: null
    })
    const [menuClass, setMenuClass] = useState<string>(menuShowClass[isOpen])
    //   const logout = useLogout()
    const router = useRouter()

    const closeMenu = () => {
        setMenuClass(menuShowClass[MenuState.close])
        setTimeout(() => {
            closeFunc()
        }, 400)
    }

    const signOut = async () => {
        // await logout()
        router.push('/')
    }

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeFunc()
        }

        document.addEventListener('keydown', handleEscape)

        return () => document.removeEventListener('keydown', handleEscape)
    }, [closeFunc])

    return (
        <ul
            id="settings-menu"
            className={`absolute ${menuClass} top-full w-full xs:w-56 p-2 right-0 xs:left-auto md:-right-4 bg-white dark:bg-menu-dark-github dark:text-slate-100 border border-gray-300 dark:border-gray-500 rounded-md overflow-hidden text-sm`}
        >
            <li className="py-2 px-2 flex flex-col">
                <p className="my-2 text-[1.4em]">{currentUser?.fullName}</p>
                <span>{currentUser?.email}</span>
            </li>
            <hr className="my-2 dark:border-gray-600" />
            <Link href={`/user/${currentUser?.userName}`} onClick={closeMenu}>
                <li className="p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600">My profile</li>
            </Link>

            <Link href="/user/saved-list" onClick={closeMenu}>
                <li className="p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600">Saved list</li>
            </Link>

            <Link href={`/user/${currentUser?.userName}/account/edit`} onClick={closeMenu}>
                <li className="p-2 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600">Settings</li>
            </Link>

            <hr className="my-2 dark:border-gray-600" />

            <li onClick={signOut} className="p-2 cursor-pointer rounded-md hover:bg-indigo-50 dark:hover:bg-slate-600">Log Out</li>
        </ul >
    )
}

interface AvatarProps extends ComponentPropsWithoutRef<'img'> {
    withLink?: string
}

function UserAvatar({ withLink, ...props }: AvatarProps) {
    return (
        <>
            {withLink
                ? (
                    <Link href={withLink} className={props.className}>
                        <Image src={props.src || ''} alt='User avatar' width={40} height={40} className={`rounded-full object-cover object-center p-[1px] bg-white dark:bg-slate-400 border border-gray-300 ${props.className}`} />
                    </Link>
                )
                : (
                    <Image src={props.src || ''} alt='User avatar' width={40} height={40} className={`rounded-full object-cover object-center p-[1px] bg-white dark:bg-slate-400 border border-gray-300 ${props.className}`} />
                )}
        </>
    )
}
