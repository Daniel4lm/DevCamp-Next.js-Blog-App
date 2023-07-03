"use client"

import { createContext, useContext } from 'react'
import useDarkMode from '@/hooks/useDarkMode'
import { ProviderType, ThemeStateType } from './types'

const ThemeContext = createContext<ThemeStateType>({
    themeMode: '',
    toggleMode: () => null
})

const useThemeContext = () => {
    return useContext(ThemeContext)
}

const ThemeProvider = ({ children }: ProviderType) => {
    const { themeMode, toggleMode } = useDarkMode()

    return (
        <ThemeContext.Provider value={{ themeMode, toggleMode }}>
            {children}
        </ThemeContext.Provider>
    )
}

export { ThemeContext, useThemeContext, ThemeProvider }
