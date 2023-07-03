import { ReactNode, useState } from "react"

interface TooltipProps {
    title: string
    position: 'top' | 'bottom' | 'side'
    delay?: number
    children: ReactNode
}

const TooltipClass: { [k: string]: string } = {
    'top': 'top-tooltip-text',
    'bottom': 'bottom-tooltip-text',
    'side': 'side-tooltip-text'
}

const ToolTip = ({ title, position, delay, children }: TooltipProps) => {

    const [isActive, SetIsActive] = useState(false)
    let timeout: NodeJS.Timeout

    const showTip = () => {
        timeout = setTimeout(() => {
            SetIsActive(true);
        }, delay || 400);
    }

    const hideTip = () => {
        SetIsActive(false);
        clearTimeout(timeout)
    }

    return (
        <div
            className="relative hover-item"
            onMouseEnter={showTip}
            onMouseLeave={hideTip}
        >
            {children}
            <span className={`${TooltipClass[position]} ${isActive ? 'tooltip-text-hover' : ''} xs:w-max px-4 py-2 rounded-md bg-gray-800 text-white text-sm `}>
                {title}
            </span>
        </div>
    )
}

export default ToolTip
