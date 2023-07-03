import { ThemeProvider } from '@/context/themeContext'
import { Inter } from 'next/font/google'
import Navbar from '@/app/components/navigation/NavBar'
import ReactQueryProvider from '@/lib/reactQuery/reactQueryProvider'
import '@/app/globals.css'

const inter = Inter({ subsets: ['latin'], display: 'swap' })

export const metadata = {
  title: 'Instacamp Next App',
  description: 'Instacamp Web Blog-Tech app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

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
    `;

  return (
    <html lang="en">
      <body className={inter.className}>
        <script dangerouslySetInnerHTML={{ __html: initialThemeScript }} ></script>
        <ThemeProvider>
          <ReactQueryProvider>
            <>
              <Navbar title="Campy" />
              <main role="main" className="relative w-full min-h-screen bg-main-background antialiased dark:bg-main-dark dark:text-slate-100 flex flex-col">
                {children}
              </main>
            </>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
