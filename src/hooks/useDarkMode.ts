import { useState, useEffect } from 'react'
import isBrowser from '@/lib/isBrowser'

function useDarkMode(status?: "authenticated" | "loading" | "unauthenticated") {
    const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => getModeFromChache())

    function getModeFromChache() {
        const checkMode = isBrowser() && window.localStorage.getItem('theme')
        return (checkMode) ? JSON.parse(checkMode) : 'dark'
    }

    useEffect(() => {
        window.localStorage.setItem('theme', JSON.stringify(themeMode))
    }, [themeMode])

    const toggleMode = () => {
        setThemeMode(themeMode => (themeMode === 'light') ? 'dark' : 'light')
        changeTheme()
    }

    const changeTheme = () => {
        if (status === 'authenticated') {
            document.body.classList.toggle('dark')
        } else {
            document.documentElement.classList.toggle('dark')
        }
    }

    return { themeMode, toggleMode }
}

export default useDarkMode
