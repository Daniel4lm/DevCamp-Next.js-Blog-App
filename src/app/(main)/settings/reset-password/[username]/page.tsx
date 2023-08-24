"use client"

import { Field, Form, Formik } from 'formik'
import { useState } from "react"
import { HidePassIcon, ShowPassIcon } from "@/components/Icons"
import { object, z } from "zod"
import { toFormikValidationSchema } from "zod-formik-adapter"
import { signOut } from "next-auth/react"
import { notFound, useRouter } from "next/navigation"

function ForgotPasswordPage({ searchParams }: {
  searchParams: {
    token: string,
    email: string
  }
}) {

  const { email, token } = searchParams
  const router = useRouter()
  const [passwordToggle, setPasswordToggle] = useState<'newPassword' | 'passwordConfirm' | null>()
  const [errMsg, setErrMsg] = useState<string | null>('')
  const [successMsg, setSuccess] = useState<string | null>(null)

  if (!email || !token) return notFound()

  const PasswordResetValidationSchema = object({
    newPassword: z.string({ required_error: 'Password is required' }).min(6, { message: 'Password must be 6 or more characters long!' }),
    passwordConfirm: z.string({ required_error: 'Password is required' }).min(6, { message: 'Password must be 6 or more characters long!' })
  })
    //.refine((data) => data.newPassword === data.passwordConfirm, { message: 'Password does not match', path: ['newPassword', 'passwordConfirm'] })
    .superRefine((data, ctx) => {
      if (data.newPassword !== data.passwordConfirm) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords does not match",
          path: ['newPassword']
        })

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Passwords does not match",
          path: ['passwordConfirm']
        })
      }
    })

  const togglePassword = (field: 'newPassword' | 'passwordConfirm') => {
    setPasswordToggle(passVisible => passVisible === field ? null : field)
  }

  async function onLogOut() {
    await signOut()
    router.push("/")
  }

  return (
    <section className="relative w-full py-4 md:px-4 text-sm md:text-base border-l md:rounded-lg bg-white dark:bg-[#344453] dark:text-slate-300 dark:border-gray-600 shadow-slate-200 dark:shadow-none">

      <h1 className="my-4 text-2xl md:text-3xl text-center font-medium">NEW CREDENTIALS</h1>
      <p className='sm:w-1/2 mx-auto text-center'>You can change your password</p>
      <Formik
        initialValues={{
          newPassword: '',
          passwordConfirm: ''
        }}
        validationSchema={toFormikValidationSchema(PasswordResetValidationSchema)}
        onSubmit={async (values) => {
          setErrMsg(null)

          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/password/reset-password`, {
              method: 'POST',
              body: JSON.stringify({
                password: values.passwordConfirm,
                token: token,
                email: email
              }),
              headers: {
                "Content-Type": "application/json",
              },
            })

            const data = await response.json()

            if (!response.ok) {
              setErrMsg(data?.error || data?.message)
              return
            }

            setErrMsg(null)
            setSuccess(data.message)

          } catch (err: any) {
            setSuccess(null)
            setErrMsg(`Password reset error: ${err.message}`)
          }
        }}
      >
        {({ errors, touched, isValid, isSubmitting }) => (
          <Form
            id="update-password-form"
            className="flex flex-col space-y-4 xs:space-y-6 md:space-y-8 w-full py-8 text-sm md:text-base"
          >
            {errMsg ? (
              <div className={'w-auto alert alert-danger p-4 m-4 rounded-sm text-center'} aria-live="assertive">
                {errMsg}
              </div>
            ) : successMsg ? (
              <div className="flex flex-col gap-y-2">
                <div className={'w-auto alert alert-info p-4 m-4 rounded-sm text-center'} aria-live="assertive">
                  {successMsg}
                </div>
                <button
                  className={'block px-4 xs:px-8 py-1 xs:py-2 md:w-max border-2 border-indigo-500 rounded-full font-semibold text-sm text-indigo-500 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white cursor-pointer'}
                  onClick={onLogOut}
                >
                  Log out
                </button>
              </div>
            ) : null}
            <div className="flex items-start flex-col md:flex-row">
              <label htmlFor="newPassword" className="md:w-1/3 pl-4 xs:pl-8 mb-1 md:p-2 md:m-0 md:text-right">New Password</label>
              <div className="relative w-full pl-4 xs:pl-8 pr-4 xs:pr-8">
                <div className="relative w-full">
                  <Field
                    id='new-password-field'
                    name='newPassword'
                    required
                    aria-invalid={errors.newPassword ? 'true' : 'false'}
                    aria-describedby="pwdnote"
                    type={passwordToggle === 'newPassword' ? 'text' : 'password'}
                    className={'w-full rounded p-2 border border-gray-300 dark:bg-slate-600 dark:text-slate-100 dark:border-slate-400 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:border-transparent dark:focus:ring-blue-400 focus:ring-opacity-90 focus:border-transparent'}
                  />
                  <div
                    className="absolute w-5 h-max top-1/2 right-2 -translate-y-1/2 text-gray-400 cursor-pointer"
                    id="user-registration-show-password"
                    onClick={() => togglePassword('newPassword')}
                  >
                    {passwordToggle === 'newPassword' ? <HidePassIcon /> : <ShowPassIcon />}
                  </div>
                </div>
                {touched.newPassword && errors.newPassword ? (
                  <div className='flex items-center gap-2 invalid-feedback'>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-4 h-4'>
                      <path d="M7.5 14.2007C11.0899 14.2007 14 11.2905 14 7.70068C14 4.11083 11.0899 1.20068 7.5 1.20068C3.91015 1.20068 1 4.11083 1 7.70068C1 11.2905 3.91015 14.2007 7.5 14.2007Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.4498 5.75061L5.5498 9.65061" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5.5498 5.75061L9.4498 9.65061" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <span key={`${errors.newPassword}`} className='invalid-feedback'>{errors.newPassword}</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="flex items-start flex-col md:flex-row">
              <label htmlFor='passwordConfirm' className='md:w-1/3 pl-4 xs:pl-8 mb-1 md:p-2 md:m-0 md:text-right'>Confirm Password</label>
              <div className="relative w-full pl-4 xs:pl-8 pr-4 xs:pr-8">
                <div className="relative w-full">
                  <Field
                    id='confirm-password-field'
                    name='passwordConfirm'
                    required
                    aria-invalid={errors.passwordConfirm ? 'true' : 'false'}
                    aria-describedby="pwdnote"
                    type={passwordToggle === 'passwordConfirm' ? 'text' : 'password'}
                    className={'w-full rounded p-2 border border-gray-300 dark:bg-slate-600 dark:text-slate-100 dark:border-slate-400 shadow-sm focus:ring-2 focus:ring-indigo-500 dark:focus:border-transparent dark:focus:ring-blue-400 focus:ring-opacity-90 focus:border-transparent'}
                  />
                  <div
                    className="absolute w-5 h-max top-1/2 right-2 -translate-y-1/2 text-gray-400 cursor-pointer"
                    id="user-registration-show-password"
                    onClick={() => togglePassword('passwordConfirm')}
                  >
                    {passwordToggle === 'passwordConfirm' ? <HidePassIcon /> : <ShowPassIcon />}
                  </div>
                </div>
                {touched.passwordConfirm && errors.passwordConfirm ? (
                  <div className='flex items-center gap-2 invalid-feedback'>
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className='w-4 h-4'>
                      <path d="M7.5 14.2007C11.0899 14.2007 14 11.2905 14 7.70068C14 4.11083 11.0899 1.20068 7.5 1.20068C3.91015 1.20068 1 4.11083 1 7.70068C1 11.2905 3.91015 14.2007 7.5 14.2007Z" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.4498 5.75061L5.5498 9.65061" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M5.5498 5.75061L9.4498 9.65061" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>

                    <span key={`${errors.passwordConfirm}`} className='invalid-feedback'>{errors.passwordConfirm}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {/* {<div className="flex items-start flex-col md:flex-row md:items-center">
              <label className="block md:w-1/3 font-semibold text-right"></label>
              <div className="relative w-full pl-4 xs:pl-8 pr-4 xs:pr-8">
                <div className="lg:w-4/6 overflow-hidden rounded-lg border border-neutral-300 bg-white dark:border-slate-400 dark:bg-slate-700">
                  <button
                    id="pass-hystory"
                    className="group relative flex w-full items-center rounded-t-[15px] border-0 bg-white hover:bg-neutral-100 py-3 px-5 text-left text-sm md:text-base text-neutral-800 transition hover:z-[2] focus:z-[3] focus:outline-none dark:bg-slate-600 dark:text-white [&:not([data-te-collapse-collapsed])]:bg-white [&:not([data-te-collapse-collapsed])]:text-primary dark:[&:not([data-te-collapse-collapsed])]:bg-slate-700 dark:[&:not([data-te-collapse-collapsed])]:text-primary-400"
                    type="button"
                    phx-click={JS.toggle(to: "#collapse-body")}
                    >
                  Password history
                  <span className="ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out group-[[data-te-collapse-collapsed]]:fill-[#212529] motion-reduce:transition-none dark:fill-blue-300 dark:group-[[data-te-collapse-collapsed]]:fill-white">
                    <Icons.select_arrow />
                  </span>
                </button>
                <div
                  id="collapse-body"
                  className="hidden border-t dark:border-slate-400"
                  aria-labelledby="headingOne"
                  data-te-parent="#accordionExample"
                >
                  <div className="py-4 px-5 flex justify-between">
                    <%= unless @password_updated_at do %>
                    <strong>Not changed yet</strong>
                    <% else %>
                    <span><strong>Last changed</strong></span>
                    <span>
                      <%= DateTimeHelper.format_post_date(
                      @password_updated_at,
                      "%-d %b, %Y"
                            ) %>
                    </span>
                    <% end %>
                  </div>
                </div>
                </div>
                </div>
              </div >} */}

            <div className="flex items-start flex-col md:flex-row md:items-center">
              <label className="block md:w-1/3 font-semibold text-right"></label>
              <div className="w-full pl-4 xs:pl-8 pr-4 xs:pr-8">
                <button type="submit" disabled={!isValid || isSubmitting}
                  className={'px-4 xs:px-6 py-1 xs:py-2 md:w-max border-2 border-indigo-400 bg-transparent rounded-xl font-semibold text-indigo-400 dark:text-indigo-400 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white cursor-pointer duration-150'}
                >
                  {isSubmitting ? 'Saving...' : 'Change Password'}
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </section>
  )
}

export default ForgotPasswordPage
