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
            <section className="w-[95%] md:w-2/3 xl:w-[40rem] bg-white dark:bg-[#344453] dark:text-slate-100 border border-b-0 border-gray-300 dark:border-gray-600 flex flex-col place-items-center mx-auto py-4 md:p-6 sm:rounded-t-lg -mt-24">
                <UserLoginForm />
                <p className="text-md px-10 text-center mt-4 text-indigo-600 hover:underline">
                    <Link href={'/settings/verify-email'}>Forgot password?</Link>
                </p>
            </section>

            <section className="w-[95%] md:w-2/3 xl:w-[40rem] bg-slate-50 dark:bg-[#344453] dark:text-slate-100 border border-gray-300 dark:border-gray-600 flex flex-col place-items-center mx-auto -mt-[1px] p-6 sm:rounded-b-lg my-6">
                <p className="text-base">
                    Don't have an account?
                    <SmartLink href={'/auth/register'}>
                        <span className="m-1 px-1 font-medium hover:underline text-indigo-600">Sign up</span>
                    </SmartLink>
                </p>
            </section>
        </>
    )
}
