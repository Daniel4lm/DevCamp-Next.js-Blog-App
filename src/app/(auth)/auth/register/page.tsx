import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import UserSignupForm from "./Form"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"
import SmartLink from "@/app/components/navigation/SmartLink"

export default async function UserRegistrationPage() {

    const session = await getServerSession(authOptions)
    if (session?.user) redirect("/")

    return (
        <>
            <section className="w-[95%] md:w-2/3 xl:w-[40rem] bg-white dark:bg-[#3a4149] dark:text-slate-100 border dark:border-transparent flex flex-col place-items-center mx-auto p-4 md:p-6 rounded-lg md:rounded-2xl -mt-24">
                <h1 className="my-4 text-xl md:text-2xl font-medium text-center">
                    Sign up to InstaCamp and share materials with your friends
                </h1>
                <UserSignupForm />
                <p className="text-sm md:px-10 text-center mt-4 text-gray-600 dark:text-white font-light">
                    By signing up, you agree to our Terms , Data Policy and Cookies Policy .
                </p>
            </section>

            <section className="w-[95%] md:w-2/3 xl:w-[40rem] bg-white dark:bg-[#3a4149] dark:text-slate-100 border dark:border-transparent flex flex-col place-items-center mx-auto p-6 rounded-lg md:rounded-2xl mt-6">
                <p className="text-base">
                    Have an account?
                    <SmartLink href={'/api/auth/signin'}>
                        <span className="m-1 font-medium text-indigo-600 hover:text-indigo-400">Log in</span>
                    </SmartLink>
                </p>
            </section >
        </>
    )
}
