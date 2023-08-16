"use client"

import { ChangeEvent, DragEvent, useState } from 'react'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Formik, Form, Field } from 'formik'
import FormikTextArea from '@/components/forms/FormikControls'
import { object, z } from 'zod'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { CloseUploadIcon, ThemeIcon, UploadImage } from '@/components/Icons'

const MAX_FILE_SIZE = 5000000

interface AccountFormProps {
    userData: { [x: string]: string }
}

async function updateUser({ formData, username }: { formData: FormData, username: string }) {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/users/${username}`, {
        method: 'PUT',
        body: formData
    })
    return await res.json()
}

function AccountForm({ userData }: AccountFormProps) {

    const [avatarImage, setAvatarImage] = useState<File>()
    const [avatarDrag, setAvatarDrag] = useState(false)
    const [errMsg, setErrMsg] = useState<string | null>('')

    const { data: session, update: updateSession } = useSession()

    const router = useRouter()

    const userMutation = useMutation({
        mutationFn: updateUser,
        onSuccess: (userJson, { username }) => {

            const updatedUser = userJson?.updatedUser

            if (!updatedUser) {
                if (userJson?.error) {
                    setErrMsg(userJson.error)
                } else {
                    setErrMsg("Something went wrong, check your console.")
                }
                return
            }

            updateSession({
                ...session,
                user: {
                    ...(typeof session?.user === 'object' ? session?.user : {}),
                    ...{
                        email: updatedUser.email,
                        fullName: updatedUser.fullName,
                        username: updatedUser.username,
                        avatarUrl: updatedUser.avatarUrl,
                        themeMode: updatedUser.profile.themeMode
                    }
                }
            })
            
            router.replace(`/user/${username}`)
        }
    })

    const AccountValidationSchema = object({
        email: z.string().trim().email({ message: 'Needs to be valid email!' }),
        fullName: z.string().trim().min(4, { message: 'Name must be 4 or more characters long!' }),
        username:
            z.string().trim().toLowerCase()
                .min(4, { message: 'Username must be 4 or more characters long!' })
                .regex(
                    /^[a-zA-Z0-9_]+$/,
                    "The username must contain only letters, numbers and underscore (_)"
                ),
        location: z.string().trim().min(3, { message: 'Location must contain least 3 characters!' }).optional(),
        website: z.string().trim().url().optional(),
        bio: z.string().trim().min(20, { message: 'Bio too short' }).optional(),
        siteTheme: z.string(),
        avatarUrl:
            z.any().
                refine(() => {
                    if (avatarImage && checkFileFormat(avatarImage) || userData.avatarUrl) return true
                }, { message: 'Only .png, .jpg and .jpeg format allowed!' })
                .optional()
    })

    const onImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event?.target.files && event?.target.files[0]
        if (file && checkFileSize(file) && checkFileFormat(file)) setAvatarImage(file)
    }

    const cancelImageUpload = () => {
        setAvatarImage(undefined)
        setErrMsg(null)
    }

    const handleDrag = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()

        if (event.type === 'dragenter' || event.type === 'dragover') {
            setAvatarDrag(true)
        } else if (event.type === 'dragleave') {
            setAvatarDrag(false)
        }
    }

    const handleDrop = (event: DragEvent) => {
        event.preventDefault()
        event.stopPropagation()
        setAvatarDrag(false)

        const file = event.dataTransfer?.files && event.dataTransfer?.files[0]

        if (file && checkFileSize(file) && checkFileFormat(file)) {
            setAvatarImage(file)
        }
    }

    const checkFileFormat = (file: File) => {
        if (file) {
            if (['image/png', 'image/jpeg', 'image/jpg'].includes(file?.type)) {
                setErrMsg(null)
                return true
            } else {
                setErrMsg('Only .png, .jpg and .jpeg format allowed!')
                return false
            }
        }
    }

    const checkFileSize = (file: File) => {
        if (file) {
            if (file.size <= MAX_FILE_SIZE) {
                setErrMsg(null)
                return true
            } else {
                setErrMsg('Max file size is 5MB!')
                return false
            }
        }
    }

    return (
        <div className="relative w-full py-8 text-sm md:text-base border-t border-b md:border md:rounded-lg bg-white dark:bg-[#344453] dark:text-slate-300 dark:border-gray-600 shadow-slate-200 dark:shadow-none">
            <>
                <Formik
                    initialValues={userData}
                    validationSchema={toFormikValidationSchema(AccountValidationSchema)}
                    onSubmit={(values) => {

                        setErrMsg(null)

                        const formData = new FormData()
                        Array.from(Object.keys(values)).forEach(field => {
                            if (field !== 'avatarUrl') formData.append(field, values[field as keyof typeof values])
                        })

                        if (avatarImage) formData.set('avatarUrl', avatarImage as File)

                        try {
                            userMutation.mutate({
                                formData: formData,
                                username: values.username
                            })
                        } catch (err) {
                            console.error(err)
                        }
                    }}
                >
                    {({ values, errors, touched, isValid, isSubmitting }) => (
                        <Form
                            id="user-settings-form"
                            className='space-y-4 xs:space-y-6 md:space-y-10'
                        >
                            <div className="overflow-hidden mx-auto md:-mt-20 flex flex-col items-center mb-8">
                                <div id="drag-drop-container" onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag}
                                    onDrop={handleDrop}
                                >
                                    {!avatarImage?.name
                                        ? (
                                            <label
                                                id="user-photo"
                                                htmlFor="avatarUrl"
                                                className="relative block cursor-pointer"
                                            >
                                                <div
                                                    id="avatar-icon"
                                                    className={`max-w-[8rem] h-[8rem] mx-auto bg-white dark:bg-[#344453] rounded-full ${avatarDrag ? 'border-orange-400' : 'border-indigo-200'} border-2 md:border-4 p-1 while-submitting-form`}
                                                >
                                                    {userData.avatarUrl ?
                                                        (<Image
                                                            alt='User Avatar'
                                                            src={![null, 'undefined'].includes(userData.avatarUrl) ? userData.avatarUrl : '/defaultAvatar.png'}
                                                            width={600}
                                                            height={400}
                                                            loading="eager"
                                                            style={{
                                                                objectFit: 'cover',
                                                                objectPosition: 'center',
                                                                width: '100%',
                                                                height: '100%',
                                                            }}
                                                            className='rounded-full'
                                                        />)
                                                        :
                                                        (
                                                            <Image
                                                                alt='User Avatar'
                                                                src={'/defaultAvatar.png'}
                                                                width={600}
                                                                height={400}
                                                                loading="eager"
                                                                style={{
                                                                    objectFit: 'cover',
                                                                    objectPosition: 'center',
                                                                    width: '100%',
                                                                    height: '100%',
                                                                }}
                                                                className='rounded-full'
                                                            />
                                                        )
                                                    }
                                                    <div
                                                        id="show-upload-icon"
                                                        className={`absolute hidden left-1/2 top-1/2 w-max text-black rounded-lg p-1 bg-white
                                                    ${avatarImage?.name ? ' text-opacity-60 bg-opacity-60' : ' bg-opacity-90'}`
                                                        }
                                                    >
                                                        <UploadImage />
                                                    </div>
                                                </div>
                                            </label>
                                        )
                                        : (
                                            <>
                                                <label htmlFor='avatarUrl' className="flex cursor-pointer justify-center">
                                                    <div
                                                        id="user-image"
                                                        className={`max-w-[8rem] h-[8rem] mx-auto bg-white dark:bg-[#344453] rounded-full border ${avatarDrag ? 'border-orange-400' : 'border-indigo-200'} p-1 while-submitting-form`}
                                                    >
                                                        <Image
                                                            alt='User Avatar 2'
                                                            src={avatarImage ? URL.createObjectURL(avatarImage) : ''}
                                                            width={600}
                                                            height={400}
                                                            loading="eager"
                                                            style={{
                                                                objectFit: 'cover',
                                                                objectPosition: 'center',
                                                                width: '100%',
                                                                height: '100%',
                                                            }}
                                                            className='rounded-full'
                                                        />
                                                    </div>
                                                </label>
                                                <div className="mt-4">
                                                    <p className="w-auto break-all text-base font-semibold text-center text-green-700 dark:text-green-400 mx-auto m-2">
                                                        After image upload, login again to see changes!
                                                    </p>
                                                    <p className="w-max break-all text-base text-center mx-auto">
                                                        Image selected:
                                                    </p>
                                                </div>
                                                <div className="w-fit mx-auto m-2 relative flex items-center pl-4 py-[0.2rem] pr-2 rounded-2xl sm:rounded-full bg-indigo-400 dark:bg-slate-500 text-white">
                                                    <label className="w-auto break-all text-[0.9rem]">
                                                        {avatarImage?.name}
                                                    </label>
                                                    <div
                                                        id="cancel-image-upload"
                                                        onClick={cancelImageUpload}
                                                        className="w-[1.1rem] h-[1.1rem] opacity-80 text-white cursor-pointer ml-2 rounded-full flex justify-center items-center
                                                        hover:opacity-100 hover:transition-all hover:duration-[600] hover:ease-in-out text-[1.1rem]"
                                                    >
                                                        <CloseUploadIcon />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                    <input id='avatarUrl' hidden type='file' accept='image/png, image/jpeg, image/jpg' onChange={onImageUpload} />
                                </div>
                            </div>
                            {values.username.length > 0 ? (
                                <div className="w-max max-w-[50%] m-auto overflow-hidden">
                                    <p className="leading-none rounded-full border-2 border-gray-200 dark:border-slate-400 px-3 py-2 md:py-0 md:text-lg truncate">
                                        {values.username}
                                    </p>
                                </div>
                            ) : null}
                            {(errMsg || errors.avatarUrl) ? (
                                <div className={'w-auto alert alert-info p-4 m-4 rounded-sm text-center'} aria-live="assertive">
                                    {errMsg || errors.avatarUrl}
                                </div>
                            ) : null}

                            <div className="flex items-start flex-col md:flex-row">
                                <label htmlFor="fullName" className="md:w-1/3 pl-4 xs:pl-8 mb-1 md:p-2 md:m-0 md:text-right">Full name</label>
                                <div className="relative w-full pl-4 xs:pl-8 pr-4 xs:pr-8">
                                    <Field
                                        id='fullname-field'
                                        name='fullName'
                                        type='text'
                                        className={'w-full text-sm md:text-base rounded p-2 duration-150 border border-neutral-300 dark:bg-gray-700 dark:text-slate-100 dark:border-slate-500 text-semibold text-gray-600 focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-80 focus:border-transparent dark:focus:border-transparent dark:focus:ring-blue-400'}
                                    />
                                    {touched.fullName && errors.fullName ? (
                                        <span key={`${errors.fullName}`} className='invalid-feedback'>{errors.fullName}</span>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex items-start flex-col md:flex-row">
                                <label htmlFor='username' className='md:w-1/3 pl-4 xs:pl-8 mb-1 md:p-2 md:m-0 md:text-right'>Username</label>
                                <div className="relative w-full pl-4 xs:pl-8 pr-4 xs:pr-8">
                                    <Field
                                        name='username'
                                        type='text'
                                        className={'w-full text-sm md:text-base rounded p-2 duration-150 border border-neutral-300 dark:bg-gray-700 dark:text-slate-100 dark:border-slate-500 text-semibold text-gray-600 focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-80 focus:border-transparent dark:focus:border-transparent dark:focus:ring-blue-400'}
                                    />
                                    {touched.username && errors.username ? (
                                        <span key={`${errors.username}`} className='invalid-feedback'>{errors.username}</span>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex items-start flex-col md:flex-row">
                                <label htmlFor='location' className='md:w-1/3 pl-4 xs:pl-8 mb-1 md:p-2 md:m-0 md:text-right'>Location</label>
                                <div className="relative w-full pl-4 xs:pl-8 pr-4 xs:pr-8">
                                    <Field
                                        name='location'
                                        type='text'
                                        className={'w-full text-sm md:text-base rounded p-2 duration-150 border border-neutral-300 dark:bg-gray-700 dark:text-slate-100 dark:border-slate-500 text-semibold text-gray-600 focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-80 focus:border-transparent dark:focus:border-transparent dark:focus:ring-blue-400'}
                                    />
                                    {touched.location && errors.location ? (
                                        <span key={`${errors.location}`} className='invalid-feedback'>{errors.location}</span>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex items-start flex-col md:flex-row">
                                <label htmlFor='website' className='md:w-1/3 pl-4 xs:pl-8 mb-1 md:p-2 md:m-0 md:text-right'>Website URL</label>
                                <div className="relative w-full pl-4 xs:pl-8 pr-4 xs:pr-8">
                                    <Field
                                        name='website'
                                        type='text'
                                        className={'w-full text-sm md:text-base rounded p-2 duration-150 border border-neutral-300 dark:bg-gray-700 dark:text-slate-100 dark:border-slate-500 text-semibold text-gray-600 focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-80 focus:border-transparent dark:focus:border-transparent dark:focus:ring-blue-400'}
                                    />
                                    {touched.website && errors.website ? (
                                        <span key={`${errors.website}`} className='invalid-feedback'>{errors.website}</span>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex items-start flex-col md:flex-row">
                                <FormikTextArea name='bio' rows={4} label='Bio' />
                            </div>

                            <div className="flex items-start flex-col md:flex-row">
                                <label htmlFor='email' className='md:w-1/3 pl-4 xs:pl-8 mb-1 md:p-2 md:m-0 md:text-right'>Email</label>
                                <div className="relative w-full pl-4 xs:pl-8 pr-4 xs:pr-8">
                                    <Field
                                        name='email'
                                        type='email'
                                        aria-invalid={errors.email ? 'true' : 'false'}
                                        aria-describedby="uidnote"
                                        className={'w-full text-sm md:text-base rounded p-2 duration-150 border border-neutral-300 dark:bg-gray-700 dark:text-slate-100 dark:border-slate-500 text-semibold text-gray-600 focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-80 focus:border-transparent dark:focus:border-transparent dark:focus:ring-blue-400'}

                                    />
                                    {touched.email && errors.email ? (
                                        <span key={`${errors.email}`} className='invalid-feedback'>{errors.email}</span>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex items-start flex-col md:flex-row">
                                <label className='md:w-1/3 pl-4 xs:pl-8 mb-1 md:p-2 md:m-0 md:text-right'>Site theme</label>
                                <div className="relative w-full pl-8 pr-8 flex items-center gap-4 ">

                                    <div className="relative flex items-center gap-2">
                                        {['LIGHT', 'DARK'].map((theme) => (
                                            <div key={theme}>
                                                <Field
                                                    id={theme}
                                                    name="siteTheme"
                                                    type='radio'
                                                    value={theme}
                                                    className='hidden peer p-0 right-2 top-1/2 -translate-y-1/2 cursor-pointer w-4 h-4 text-indigo-400 bg-gray-100 border-gray-300 focus:ring-indigo-400 dark:focus:ring-slate-400 dark:ring-offset-gray-500 focus:ring-2 dark:bg-slate-600 dark:border-slate-500' />
                                                <label
                                                    htmlFor={theme}
                                                    className='px-4 py-1 text-gray-600 flex justify-between items-center border dark:border-transparent rounded-full bg-gray-50 dark:bg-slate-500 cursor-pointer duration-150 hover:border-transparent hover:ring-2 hover:ring-neutral-400 hover:dark:ring-neutral-400 hover:ring-opacity-40 dark:peer-checked:ring-slate-400 peer-checked:text-indigo-400 peer-checked:dark:ring-neutral-200 peer-checked:dark:text-white peer-checked:ring-2 peer-checked:ring-indigo-400 peer-checked:border-transparent peer-checked:ring-opacity-90 dark:text-slate-100'>
                                                    <span className="capitalize pr-4">{theme}</span>
                                                    <ThemeIcon type={theme} />
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <hr></hr>

                            <div className="flex items-start flex-col md:flex-row md:items-center">
                                <label className="block md:w-1/3 font-semibold text-right"></label>
                                <div className="w-full pl-4 xs:pl-8 pr-4 xs:pr-8">
                                    <button type="submit" disabled={!isValid || isSubmitting}
                                        className={'px-6 py-2 border-2 border-indigo-400 bg-transparent rounded-full font-semibold text-indigo-500 dark:text-indigo-300 hover:border-indigo-500 hover:bg-indigo-500 hover:text-white cursor-pointer duration-150'}
                                    >
                                        {isSubmitting ? 'Saving...' : 'Update profile'}
                                    </button>
                                </div>
                            </div>
                        </Form>
                    )}
                </Formik>
            </>
        </div >
    )
}

export default AccountForm
