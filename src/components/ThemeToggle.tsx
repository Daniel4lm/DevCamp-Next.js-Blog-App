"use client"

import { useThemeContext } from '@/context/ThemeContext'
import { MoonIcon, SunIcon } from './Icons'

export const ThemeToggle = () => {
    const { toggleMode } = useThemeContext()

    return (
        <button
            id="theme-toggle"
            className="rounded-full border-2 border-transparent hover:border-slate-100 dark:ring-2 dark:border-none ring-slate-200 dark:ring-slate-500 hover:bg-slate-100 dark:hover:bg-slate-500"
            onClick={() => toggleMode()}
        >
            <div className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9">
                <SunIcon />
                <MoonIcon />
            </div>
        </button>
    )
}
