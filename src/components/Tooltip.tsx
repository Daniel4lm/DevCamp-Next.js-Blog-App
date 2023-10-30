"use client"

import { MouseEvent, ReactNode, useState } from "react"

interface TooltipProps {
    title: string
    position: 'top' | 'bottom' | 'left' | 'right'
    delay?: number
    children: ReactNode
}

const TooltipClass: { [k: string]: string } = {
    'top': 'top-tooltip-text',
    'bottom': 'bottom-tooltip-text',
    'left': 'left-tooltip-text',
    'right': 'right-tooltip-text',
}

const ToolTip = ({ title, position, delay, children }: TooltipProps) => {

    const [isActive, setIsActive] = useState(false)
    let timeout: NodeJS.Timeout

    const showTip = () => {
        timeout = setTimeout(() => {
            setIsActive(true);
        }, delay || 400);
    }

    const hideTip = () => {
        setIsActive(false);
        clearTimeout(timeout)
    }

    return (
        <div
            className="relative hover-item"
            onMouseEnter={showTip}
            onMouseLeave={hideTip}
        >
            {children}
            <span className={`${TooltipClass[position]} ${isActive ? 'tooltip-text-hover' : ''} xs:w-max px-4 py-2 rounded-md bg-gray-800 text-white text-sm`}>
                {title}
            </span>
        </div>
    )
}

function WelcomeTooltip({ closeTooltip }: { closeTooltip: () => void }) {

    const [isActive, setIsActive] = useState(true)

    const hideTooltip = (event: MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setIsActive(false);
        closeTooltip()
    }

    return (
        <div
            className={`${isActive ? 'absolute' : 'hidden'} top-full !cursor-auto`}
            id="tooltipclose-profilevisited"
            data-tooltip="profile_visited"
            onClick={(e) => e.stopPropagation()}
        >
            <svg
                className="absolute top-3 left-2 -translate-x-1/2 w-12 h-12 fill-current stroke-current text-indigo-400"
                width="12"
                height="12"
            >
                <rect x="12" y="-12" width="12" height="12" transform="rotate(45)" />
            </svg>
            <div className="absolute top-3 -right-6 translate-y-2 flex flex-col gap-y-3 w-48 p-4 sm:p-6 font-sohne text-sm text-white bg-indigo-400 rounded-lg">
                <span>Take a moment to visit your profile</span>
                <button className="w-max border border-slate-300 text-white px-2 py-1 rounded-md hover:bg-indigo-300" onClick={hideTooltip}>Ok, got it!</button>
            </div>
        </div>
    )
}

export { ToolTip, WelcomeTooltip } 
