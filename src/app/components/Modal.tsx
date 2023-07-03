"use client"

import React, { MouseEvent } from "react";
import { createPortal } from "react-dom"
import { CloseIcon } from "./Icons"

interface ModalType {
    isOpen: boolean
    onClose: () => void
    title?: string
    type?: 'INFO' | 'WARN' | 'DIALOG'
    style?: string
    children?: React.ReactNode | React.ReactNode[]
}

function Modal({ isOpen, onClose, title, type = 'INFO', style, children }: ModalType) {

    if (!isOpen) return null

    const stopClick = (e: MouseEvent) => {
        e.stopPropagation()
    }

    const dialogFrame = () => {
        return (
            <>
                <div className="w-full h-full bg-gray-800 opacity-60 fixed top-0 left-0 z-100 p-8 transition-all" />
                <div className="fixed top-0 left-0 z-[150] w-full h-full overflow-hidden overflow-y-auto outline-0" onClick={onClose}>
                    <div className={`absolute z-[400] ${style}`}
                        onClick={stopClick}
                    >
                        <header className="flex justify-between gap-2 bg-gray-50 dark:bg-slate-600 p-2 border-b dark:border-slate-400 rounded-t-lg">
                            <h2 id="follow-list-title" className="text-sm xs:text-base font-medium">
                                {title}
                            </h2>
                            <button onClick={onClose} >
                                <CloseIcon />
                            </button>
                        </header>
                        <div className="p-4 text-sm xs:text-base">
                            {children}
                        </div>
                    </div>
                </div>
            </>
        )
    }

    const infoFrame = () => {
        return (
            <div className="absolute bg-emerald-300 dark:bg-emerald-600 w-max border border-emerald-400 rounded-md flex flex-col z-[400] opacity-100 right-[4vw] top-[4vh]"
                onClick={stopClick}
            >
                <header className="flex justify-between items-center gap-2 p-4 rounded-md">
                    <h2 id="follow-list-title" className="text-emerald-800 dark:text-slate-100 text-xs xs:text-sm font-medium">
                        {title}
                    </h2>
                    <button className="text-emerald-800 dark:text-slate-100" onClick={onClose} >
                        <CloseIcon />
                    </button>
                </header>
                <div className="text-sm xs:text-base">
                    {children}
                </div>
            </div>
        )
    }

    return createPortal(
        <>
            {type === 'INFO' ? (infoFrame()) : (dialogFrame())}
        </>,
        document.body as HTMLElement
    )
}

export default Modal
