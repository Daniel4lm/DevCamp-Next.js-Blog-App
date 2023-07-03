"use client"

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

const NotFoundPage = () => {
    const router = useRouter()
    const goBack = () => router.back()

    return (
        <main className="absolute w-11/12 sm:w-8/12 lg:w-5/12 xl:w-4/12 left-1/2 top-[50vh] -translate-x-1/2 -translate-y-1/2 flex flex-col px-4 py-10">

            <div className="relative flex place-items-center mx-auto w-24 h-28">
                <Image
                    className="relative dark:invert"
                    src="/404.svg"
                    alt="Not Found Logo"
                    fill={true}
                    priority
                />
            </div>

            <section className="text-neutral-600 bg-[#f1f3f7] rounded-2xl text-center px-4 py-10 mt-4">
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
