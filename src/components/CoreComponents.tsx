"use client"

import Link from "next/link"
import defaultAvatar from '../../public/defaultAvatar.png'
import Image from "next/image"
import { AvatarIcon, CloseIcon } from "./Icons"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

const UserAvatar = ({ src, link, linkClass }: { src?: string, link: string, linkClass?: string }) => {
    return (
        <Link href={link} className={`${linkClass}`}>
            {
                !src || src === 'undefined' ? (
                    <AvatarIcon styleClass={'rounded-full w-full h-full object-cover object-center p-[1px] bg-white dark:bg-slate-400 border border-gray-300'} />
                ) :
                    (
                        <Image
                            alt="User avatar"
                            className={`rounded-full w-full h-full object-cover object-center p-[1px] bg-white dark:bg-slate-400 border border-gray-300 `}
                            src={(src !== 'undefined' ? src : defaultAvatar.src) || defaultAvatar.src}
                            width={60}
                            height={60}
                            priority={true}
                        />
                    )
            }
        </Link >
    )
}

interface ModalProps {
    onClose: () => void
    onConfirmation?: () => void
    title?: string
    style?: string
    type: 'info' | 'warn' | 'dialog'
    children?: React.ReactNode | React.ReactNode[]
}

function Modal({
    onClose,
    onConfirmation,
    children,
    style,
    title,
    type
}: ModalProps) {

    const urlParams = useSearchParams()
    const modalRef = useRef<HTMLDialogElement | null>(null)
    const initialRender = useRef(true)
    const isOpen = urlParams.get('dialog')

    console.log('dialog... ', isOpen)

    useEffect(() => {

        if (initialRender.current) {
            initialRender.current = false
            return
        }

        isOpen && isOpen !== '' ?
            (['info', 'warn'].includes(type) ? modalRef.current?.show() : modalRef.current?.showModal())
            : modalRef.current?.close()
    }, [isOpen, type])

    function closeModal() {
        modalRef.current?.close()
        onClose()
    }

    function confirmModal() {
        typeof onConfirmation === "function" && onConfirmation()
        closeModal()
    }

    const showModal: JSX.Element | null = isOpen && isOpen !== '' ? (
        <dialog ref={modalRef}> {/* bg-gray-800 opacity-60 */}
            <>
                <div className="w-full h-full backdrop:bg-gray-800/50 fixed top-0 left-0 z-100 p-8 transition-all" />
                <div className="fixed top-0 left-0 z-[150] w-full h-full overflow-hidden overflow-y-auto outline-0" onClick={closeModal}>
                    <div className={`absolute z-[400] ${style}`}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <header className="flex justify-between items-center gap-2 p-4 dark:border-slate-400 rounded-t-lg">
                            <h2 id="follow-list-title" className="text-sm xs:text-base first-letter:uppercase font-semibold">
                                {title}
                            </h2>
                            <button className="text-[#8F8F8F] bg-[#F4F6FA] p-2 rounded-full" onClick={closeModal} >
                                <CloseIcon />
                            </button>
                        </header>
                        <div className="p-4 text-sm xs:text-base">
                            {children}
                        </div>
                    </div>
                </div>
            </>
        </dialog>
    ) : null

    return showModal
}


export { UserAvatar, Modal }