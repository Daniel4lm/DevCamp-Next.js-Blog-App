"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"

export default function Denied() {

    const router = useRouter()
    const goBack = () => router.back()

    return (
        <main className="absolute w-11/12 sm:w-10/12 lg:w-8/12 xl:w-6/12 left-1/2 top-[50vh] -translate-x-1/2 -translate-y-1/2 flex flex-col text-center rounded-2xl px-6 py-10 bg-transparent">
            <h1 className="text-4xl md:text-6xlxl font-semibold text-indigo-400 py-6">Access Denied</h1>
            <section className="text-neutral-600 dark:text-slate-300">
                <h1 className="text-xl sm:text-2xl font-medium my-2">You are logged in, but you do not have the
                    required access level to view this page.</h1>
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