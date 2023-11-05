import Link from 'next/link'
import Image from 'next/image'
import { Inter, Nunito } from 'next/font/google'
import { AuthProvider } from '@/context/AuthProvider'
import '@/app/styles/globals.css'

const interFont = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter'
})
const nunitoFont = Nunito({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-nunito'
})

export const metadata = {
  title: 'Campy Auth',
  description: 'User authentication',
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {

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
      <body className={`${interFont.variable} ${nunitoFont.variable}`}>
        <script dangerouslySetInnerHTML={{ __html: initialThemeScript }} ></script>
        <AuthProvider>
          <main role="main" className="relative w-full min-h-screen antialiased dark:bg-main-dark-github dark:text-slate-100">
            <section className="w-full bg-indigo-900 dark:border-b dark:border-gray-600 min-h-[250px] py-8 px-10 ">
              <div className="w-full flex justify-center text-white">
                <Link href={'/'} className="flex items-center gap-3 mx-4">
                  <Image
                    src="/assets/images/Campy.svg"
                    width={20}
                    height={20}
                    className='h-5 w-5 md:w-6 md:h-6'
                    alt="App Logo"
                  />
                  <h4 className="text-2xl md:text-3xl font-normal">Campy</h4>
                </Link>
              </div>
            </section >
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
