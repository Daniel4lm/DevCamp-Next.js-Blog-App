"use client"

import { signOut, useSession } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

function LogoutPage() {

    const router = useRouter()
    const { status } = useSession()
    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"

    async function onLogOut() {
        await signOut()
        router.push("/")
    }

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push(callbackUrl)
        }
    }, [status])

    if (status === "authenticated") {
        return (
            <section className="w-[95%] md:w-max bg-white dark:bg-[#344453] dark:text-slate-100 border border-gray-300 dark:border-gray-600 flex flex-col place-items-center mx-auto py-4 md:p-6 rounded-lg md:rounded-2xl -mt-6">
                <div className="flex flex-col items-center space-y-4 w-full px-6 text-sm md:text-base">
                    <h1 className="my-4 text-xl md:text-2xl text-center font-medium">Are you sure you want to sign out?</h1>
                    <div className="w-full flex flex-wrap items-center justify-center gap-4 py-6">
                        <button
                            className={'block px-4 xs:px-8 py-1 xs:py-2 md:w-max border border-indigo-400 shadow rounded-full font-semibold text-sm text-gray-50 hover:bg-indigo-500 bg-indigo-400 cursor-pointer'}
                            onClick={() => router.back()}
                        >
                            Go back
                        </button>
                        <button
                            className={'block px-4 xs:px-8 py-1 xs:py-2 md:w-max border border-indigo-400 shadow rounded-full font-semibold text-sm text-indigo-500 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white cursor-pointer'}
                            onClick={onLogOut}
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </section>
        )
    }
    else {
        return (
            <div className="w-full h-[25vh] flex justify-center items-center ">
                <div>
                    <div className="loader text-indigo-300 dark:text-slate-400"></div>
                    <p className="text-lg font-medium">Loading...</p>
                </div>
            </div>
        )
    }
}

export default LogoutPage
