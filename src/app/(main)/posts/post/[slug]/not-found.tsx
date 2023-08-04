"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'

const NotFound = () => {
    const router = useRouter()
    const goBack = () => router.back()

    return (
        <main className="absolute w-11/12 sm:w-8/12 lg:w-5/12 xl:w-4/12 left-1/2 top-[50vh] -translate-x-1/2 -translate-y-1/2 flex flex-col text-center rounded-2xl px-6 py-10 bg-transparent">
            <h1 className="text-5xl md:text-8xl font-semibold text-indigo-400 py-6">404</h1>

            <section className="text-neutral-600 dark:text-neutral-200">
                <h1 className="text-xl sm:text-2xl font-medium my-2">Sorry, the requested post does not exists!</h1>
                <p className="text-sm sm:text-base pt-2">
                    Please return to the
                    <span className='px-1 text-indigo-600 hover:text-indigo-400 cursor-pointer hover:underline' onClick={goBack}>previous page</span>
                    , or visit our
                    <Link href="/" className="mx-1 text-indigo-600 hover:text-indigo-400 hover:underline">
                        home page
                    </Link>
                    .
                </p>
            </section>
        </main>
    )
}

export default NotFound
