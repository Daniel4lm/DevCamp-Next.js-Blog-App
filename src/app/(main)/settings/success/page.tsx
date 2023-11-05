import SmartLink from "@/components/navigation/SmartLink"

function page() {
    return (
        <section className="h-full w-full flex justify-center items-center md:rounded-lg dark:bg-navbar-dark py-8">
            <div className="flex flex-col justify-between items-center px-11 rounded-lg-2xl w-181.5 lg:w-211 h-134 lg:h-156">
                <div className="w-full flex flex-col items-center text-primary text-center tracking-wide">
                    <p className="text-3xl font-bold mb-10">
                        Thank you for signing up to InstaCamp!
                    </p>
                    <p className="font-light text-lg w-152">
                        We have sent you verification email, please check your inbox and open the link to change password.
                    </p>

                    <p className="w-full text-center text-secondary mt-20 mb-5 lg:mb-10 text-base">
                        Already have an account?
                        <SmartLink href={'/api/auth/signin'}>
                            <span className="m-1 px-1 font-medium hover:underline text-indigo-600">Log in</span>
                        </SmartLink>
                    </p>
                </div>
            </div>
        </section >
    )
}

export default page
