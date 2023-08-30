"use client"

import { useState } from 'react'
import { Field, Form, Formik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { object, z } from 'zod'

function VerifyEmail() {

    const [errMsg, setErrMsg] = useState<string | null>('')
    const [successMessage, setSuccessMessage] = useState('')

    const LoginValidationSchema = object({
        email: z.string().trim().min(8, { message: 'Email must be 8 or more characters long!' }).email({ message: 'Invalid email. Please enter your registered email!' })
    })

    return (
        <section className="relative w-full py-8 md:px-8 text-sm md:text-base border-l md:rounded-lg bg-white dark:bg-[#344453] dark:text-slate-300 dark:border-gray-600 shadow-slate-200 dark:shadow-none">

            <Formik
                initialValues={{ email: '' }}
                validationSchema={toFormikValidationSchema(LoginValidationSchema)}
                onSubmit={async (values) => {

                    try {
                        const verifyRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/password/email-verification`, {
                            method: 'POST',
                            body: JSON.stringify(values)
                        })
                        const verifyData = await verifyRes.json()

                        if (!verifyRes.ok) {
                            setErrMsg(verifyData?.error || verifyData?.message)
                            return
                        }

                        setErrMsg(null)
                        setSuccessMessage(verifyData.message)

                    } catch (err: any) {
                        setErrMsg(`Verification error: ${err.message}`)
                    }
                }}
            >
                {({ values, errors, touched, isValid, isSubmitting }) => (
                    <Form
                        id="log-in-form"
                        className="flex flex-col space-y-4 w-full md:px-2 text-sm md:text-base"
                    >
                        <div className="p-4">
                            <h1 className="my-4 text-2xl md:text-3xl text-center font-medium">FORGOT PASSWORD</h1>
                            <p className='sm:w-1/2 mx-auto text-center'>Provide your account's email  for which you want to reset your password</p>
                            {errMsg ? (
                                <div className={'w-auto alert alert-danger p-4 m-4 rounded-sm text-center'} aria-live="assertive">
                                    {errMsg}
                                </div>
                            ) : successMessage ? (
                                <div className={'w-auto alert alert-info p-4 m-4 rounded-sm text-center'} aria-live="assertive">
                                    {successMessage}
                                </div>
                            ) : null}
                            <div className="flex flex-col py-2">
                                <label htmlFor='username' className='mb-1'>Email</label>
                                <Field
                                    id='email-field'
                                    name='email'
                                    type='email'
                                    aria-invalid={errors.email ? 'true' : 'false'}
                                    aria-describedby="uidnote"
                                    className={'rounded p-2 border border-gray-300 dark:bg-slate-600 dark:text-slate-100 dark:border-slate-400 shadow-sm text-sm md:text-base focus:ring-2 focus:ring-indigo-500 dark:focus:border-transparent dark:focus:ring-blue-400 focus:ring-opacity-90 focus:border-transparent'}
                                />
                                {touched.email && errors.email ? (
                                    <div className='flex items-center gap-2 invalid-feedback'>
                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-4 h-4'>
                                            <path d="M7.5 14.2007C11.0899 14.2007 14 11.2905 14 7.70068C14 4.11083 11.0899 1.20068 7.5 1.20068C3.91015 1.20068 1 4.11083 1 7.70068C1 11.2905 3.91015 14.2007 7.5 14.2007Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M9.4498 5.75061L5.5498 9.65061" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M5.5498 5.75061L9.4498 9.65061" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>

                                        <span key={`${errors.email}`}>{errors.email}</span>
                                    </div>
                                ) : null}
                            </div>

                            <div className="py-6">
                                <button
                                    type="submit"
                                    disabled={!isValid || isSubmitting}
                                    className={'block px-4 xs:px-6 py-1 xs:py-2 md:w-max border-2 border-indigo-400 bg-transparent dark:bg-indigo-400/20 text-indigo-400 dark:text-indigo-200 rounded-xl font-semibold hover:text-gray-50 hover:bg-indigo-500 dark:hover:bg-indigo-500 hover:border-indigo-500 cursor-pointer duration-150'}>
                                    {isSubmitting ? 'Sending email...' : 'Request reset password link'}
                                </button>
                            </div>
                        </div>
                    </Form >
                )}
            </Formik>
        </section>
    )
}

export default VerifyEmail
