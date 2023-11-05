import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { useThemeContext, ThemeProvider } from '../ThemeContext'
import { useSession } from "next-auth/react"
import { ThemeToggle } from '@/components/ThemeToggle'

/**
 * This components is for the testing purposes only
 */
const TestComponent = () => {
    const { themeMode, toggleMode } = useThemeContext()

    const handleTheme = () => toggleMode()

    return (
        <div>
            <span>
                {themeMode === "dark" ? "Use Light Theme" : "Use Dark Theme"}
            </span>

            <ThemeToggle />
        </div>
    )
}

jest.mock("next-auth/react")

describe('ThemeContext', () => {

    it('Should set the dark theme as default', () => {

        (useSession as jest.Mock).mockReturnValueOnce({
            data: {},
            status: "unauthenticated",
        })

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        )

        expect(screen.getByText('Use Light Theme')).toBeInTheDocument()
    })

    it('Should change theme', () => {

        (useSession as jest.Mock).mockReturnValue({
            data: {},
            status: "authenticated",
        })

        render(
            <ThemeProvider>
                <TestComponent />
            </ThemeProvider>
        )

        fireEvent.click(screen.getByRole('button'))
        expect(screen.getByText('Use Dark Theme')).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button'))
        expect(screen.getByText('Use Light Theme')).toBeInTheDocument()
    })
})