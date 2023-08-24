"use client"

import { usePathname } from 'next/navigation'
import { Nunito } from 'next/font/google'
import TabBar from './TabBar'

const nunitoFont = Nunito({ subsets: ['latin'], display: 'swap' })

export async function generateStaticParams() {
    return [{ section: 'account' }, { section: 'password' }]
}

export default function Layout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    return (
        <div className='w-full min-h-screen'>
            <section className={`relative antialiased flex flex-col md:flex-row md:mx-auto md:w-11/12 xl:w-8/12 2xl:w-7/12 pt-20 pb-10 ${nunitoFont.className}`}>
                <TabBar
                    styleClass="sticky md:mt-10 z-40 w-auto md:w-1/3 h-max text-xs xs:text-sm md:text-base border md:border-none md:shadow-none rounded-full md:rounded-lg bg-white dark:bg-transparent dark:text-slate-100 shadow-md dark:shadow-none dark:border-transparent shadow-slate-200 mx-2 md:mx-0 mb-2 md:mb-0 md:mr-4"
                    currentUriPath={pathname}
                />
                <div className='relative w-full md:mt-10'>
                    {children}
                </div>
            </section>
        </div>
    )
}