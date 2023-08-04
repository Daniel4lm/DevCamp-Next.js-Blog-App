import { ThemeProvider } from '@/context/themeContext'
import { Inter } from 'next/font/google'
import Navbar from '@/app/components/navigation/NavBar'
import ReactQueryProvider from '@/lib/reactQuery/reactQueryProvider'
import '@/app/globals.css'
import { AuthProvider } from '../context/AuthProvider'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/authOptions'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: 'Instacamp Next App',
  description: 'Instacamp Web Blog-Tech app',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  const session = await getServerSession(authOptions)

  const initialThemeScript = `
        const isDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        function detectThemeOnLoad() {
          if ((!('theme' in localStorage) && isDarkMode()) || JSON.parse(localStorage.getItem('theme')) === "dark") {
            document.documentElement.classList.add('dark')
          } else {
            document.documentElement.classList.remove('dark')
          }
        }

        detectThemeOnLoad()
    `
  
  const clearTheme = `
        const isDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        function detectThemeOnLoad() {
          if (document.documentElement.classList.contains('light')) {
            document.documentElement.classList.remove('light')
          } else if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark')
          }
        }

        detectThemeOnLoad()
    `
  
  function maybeChangeThemeMode() {
    if (session && session.user) {
      return session.user.themeMode.toLowerCase()
    } else {
      return 'light'
    }
  }

  return (
    <html lang="en">
      <body className={`${inter.className} ${maybeChangeThemeMode()}`}>
        <script dangerouslySetInnerHTML={{ __html: session ? clearTheme : initialThemeScript }} ></script>
        <AuthProvider>
          <ThemeProvider>
            <ReactQueryProvider>
              <>
                <Navbar title="Campy" currentUser={session?.user} />
                <main role="main" className="relative w-full min-h-screen bg-main-background antialiased dark:bg-main-dark dark:text-slate-100 flex flex-col">
                  {children}
                </main>
              </>
            </ReactQueryProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
