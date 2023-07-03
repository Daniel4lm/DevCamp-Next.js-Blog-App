import { useState, useEffect } from 'react'
import isBrowser from '../../lib/isBrowser'

function useDarkMode() {
    const [themeMode, setThemeMode] = useState<string>(() => getModeFromChache())

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
        document.documentElement.classList.toggle('dark')
    }

    return { themeMode, toggleMode }
}

export default useDarkMode
