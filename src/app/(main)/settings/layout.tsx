"use client"

import { Nunito } from 'next/font/google'
import TabBar from './TabBar'
import { usePathname } from 'next/navigation'

const nunitoFont = Nunito({ subsets: ['latin'], display: 'swap' })

export async function generateStaticParams() {
    return [{ section: 'account' }, { section: 'password' }]
}

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    return (
        <section className={`relative flex flex-col md:flex-row md:w-11/12 xl:w-8/12 2xl:w-7/12 mx-2 xs:mx-4 md:mx-auto pt-20 ${nunitoFont.className}`}>
            <TabBar
                styleClass="sticky md:mt-10 z-50 w-full md:w-1/3 h-max text-xs xs:text-sm md:text-base border rounded-full md:rounded-lg bg-white dark:bg-slate-600 dark:text-slate-100 shadow-md dark:shadow-none dark:border-transparent shadow-slate-200 mb-2 md:mb-0 md:mr-2"
                currentUriPath={pathname}
            />

            <div className='relative w-full md:mt-10'>
                {children}
            </div>

        </section>
    )
}