"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'

const NotFoundPage = () => {
    const router = useRouter()
    const goBack = () => router.back()

    return (
        <main className="flex flex-col text-center rounded-2xl px-4 py-10 bg-transparent">
            <h1 className="text-5xl md:text-8xl font-semibold text-indigo-400 py-6">404</h1>

            <section className="text-neutral-600 dark:text-neutral-200">
                <h1 className="text-xl sm:text-2xl font-medium my-2">Sorry, this page could not be found.</h1>
                <h4 className="text-base sm:text-xl font-medium my-4">
                    It's not your fault. We may have moved the page.
                </h4>
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

export default NotFoundPage
