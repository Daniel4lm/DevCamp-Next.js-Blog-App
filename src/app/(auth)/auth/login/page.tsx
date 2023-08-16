import { getServerSession } from "next-auth"
import UserLoginForm from "./Form"
import Link from 'next/link'
import { redirect } from "next/navigation"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import SmartLink from "@/components/navigation/SmartLink"

export default async function UserLoginPage() {

    const session = await getServerSession(authOptions)
    if (session?.user) redirect("/")

    return (
        <>
            <section className="w-[95%] md:w-2/3 xl:w-[40rem] bg-white dark:bg-[#344453] dark:text-slate-100 border border-gray-300 dark:border-gray-600 flex flex-col place-items-center mx-auto py-4 md:p-6 rounded-lg md:rounded-2xl -mt-24">
                <UserLoginForm />
                <p className="text-md px-10 text-center mt-4 text-indigo-600 hover:text-indigo-400">
                    <Link href={'/auth/reset-password'}>Forgot password?</Link>
                </p>
            </section >

            <section className="w-[95%] md:w-2/3 xl:w-[40rem] bg-white dark:bg-[#344453] dark:text-slate-100 border border-gray-300 dark:border-gray-600 flex flex-col place-items-center mx-auto p-6 rounded-lg md:rounded-2xl mt-6">
                <p className="text-base">
                    Don't have an account?
                    <SmartLink href={'/auth/register'}>
                        <span className="m-1 font-medium text-indigo-600 hover:text-indigo-400">Sign up</span>
                    </SmartLink>
                </p>
            </section >
        </>
    )
}
