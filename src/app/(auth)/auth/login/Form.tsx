"use client"

import { useState } from 'react'
import { useSearchParams, useRouter } from "next/navigation"
import { HidePassIcon, ShowPassIcon } from '@/app/components/Icons'
import { LoginType } from '@/app/models/AuthTypes'
import { signIn } from 'next-auth/react'
import { object, z } from 'zod'
import { Field, Form, Formik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'

const INITIAL_STATE: LoginType = {
    username: '',
    password: ''
}

function UserLoginForm() {
    const [passwordToggle, setPasswordToggle] = useState(false)
    const [errMsg, setErrMsg] = useState<string | null>('')

    const searchParams = useSearchParams()
    const callbackUrl = searchParams.get("callbackUrl") || "/"
    const router = useRouter()

    const LoginValidationSchema = object({
        username: z.string().trim().min(4, { message: 'Username must be 4 or more characters long!' }),
        password: z.string().min(6, { message: 'Password must be 8 or more characters long!' })
    })

    const togglePassword = () => setPasswordToggle(passVisible => !passVisible)

    return (
        <>
            <Formik
                initialValues={INITIAL_STATE}
                validationSchema={toFormikValidationSchema(LoginValidationSchema)}
                onSubmit={async (values) => {
                    setErrMsg(null)

                    try {
                        let regularCallbackUrl = callbackUrl.includes("/auth/logout") ? "/" : callbackUrl

                        const res = await signIn("db_provider", {
                            redirect: false,
                            username: values.username,
                            password: values.password,
                            callbackUrl: regularCallbackUrl,
                        })

                        if (res && !res?.error) {
                            router.push(regularCallbackUrl)
                        } else {
                            setErrMsg(`${res?.error}`)
                        }
                    } catch (err: any) {
                        setErrMsg(`Registrations error: ${err.message}`)
                    }
                }}
            >
                {({ values, errors, touched, isValid, isSubmitting }) => (
                    <Form
                        id="log-in-form"
                        className="flex flex-col space-y-4 w-full md:px-6 text-sm md:text-base"
                    >
                        <div className="p-4">
                            <h1 className="my-4 text-2xl md:text-3xl text-center font-medium">Log in to InstaCamp</h1>
                            <div className={errMsg ? 'w-full alert alert-danger p-4 my-4 rounded-sm text-center' : 'hidden'} aria-live="assertive">{errMsg}</div>
                            <div className="flex flex-col py-2">
                                <label htmlFor='username' className='mb-1'>Username</label>
                                <Field
                                    id='username-field'
                                    name='username'
                                    type='username'
                                    aria-invalid={errors.username ? 'true' : 'false'}
                                    aria-describedby="uidnote"
                                    className={'rounded p-2 border border-gray-300 dark:bg-slate-600 dark:text-slate-100 dark:border-slate-400 shadow-sm text-sm md:text-base focus:ring-2 focus:ring-indigo-500 dark:focus:border-transparent dark:focus:ring-blue-400 focus:ring-opacity-90 focus:border-transparent'}
                                />
                                {touched.username && errors.username ? (
                                    <span key={`${errors.username}`} className='invalid-feedback'>{errors.username}</span>
                                ) : null}
                            </div>

                            <div className="flex flex-col py-2">
                                <label htmlFor='password' className='mb-1'>Password</label>
                                <div className="relative w-full">
                                    <Field
                                        id='password-field'
                                        name='password'
                                        type={passwordToggle ? 'text' : 'password'}
                                        className={'w-full rounded p-2 border border-gray-300 dark:bg-slate-600 dark:text-slate-100 dark:border-slate-400 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:border-transparent dark:focus:ring-blue-400 focus:ring-opacity-90 focus:border-transparent'}
                                    />
                                    <div
                                        className="absolute w-5 h-max top-1/2 right-2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                        id="user-registration-show-password"
                                        onClick={togglePassword}
                                    >
                                        {passwordToggle ? <HidePassIcon /> : <ShowPassIcon />}

                                    </div>
                                </div>
                                {touched.password && errors.password ? (
                                    <span key={`${errors.password}`} className='invalid-feedback'>{errors.password}</span>
                                ) : null}
                            </div>

                            <div className="py-6">
                                <button type="submit" disabled={!isValid || isSubmitting} className={'block px-8 w-full py-2 xs:w-max border-none shadow rounded-full font-semibold text-sm text-gray-50 hover:bg-indigo-500 bg-indigo-400 cursor-pointer'}>
                                    {isSubmitting ? 'Processing...' : 'Login'}
                                </button>
                            </div>
                        </div>
                    </Form >
                )}
            </Formik>
        </>
    )
}

export default UserLoginForm
