"use client"

import { useThemeContext } from '@/context/ThemeContext'
import { MoonIcon, SunIcon } from './Icons'
import { useEffect, useState } from 'react'

export const ThemeToggle = () => {
    const { toggleMode } = useThemeContext()

    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    return (
        <>
            <button
                id="theme-toggle"
                data-test="theme-toggle"
                className="rounded-full border-2 border-transparent ring-2 dark:border-transparent ring-transparent dark:ring-slate-500 dark:hover:bg-slate-500"
                onClick={mounted ? () => toggleMode() : undefined}
            >
                <div className="flex items-center justify-center w-8 h-8 md:w-9 md:h-9">
                    <SunIcon />
                    <MoonIcon />
                </div>
            </button>
        </>
    )
}
