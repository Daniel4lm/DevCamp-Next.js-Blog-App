"use client"

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react"
import { notFound, useRouter, useSearchParams } from 'next/navigation'
import dynamic from "next/dynamic"
import Image from "next/image"
import { User as SessionUser } from "next-auth"
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useFormik } from "formik"
import { object, z } from "zod"
import { toFormikValidationSchema } from "zod-formik-adapter"
import MultiTagSelect from '@/components/forms/MultiTagSelect'
import { createSlug, postReadingTime } from '@/lib/helperFunctions'
import { UserPost } from '@/models/Post'
import UploadImageContainer from "./ImageContainer"
import PostFormSkeleton from "@/components/skeletons/PostFormSkeleton"
const BodyEditor = dynamic(() => import("@/components/forms/ContentEditor"), { ssr: false })
import 'react-quill/dist/quill.snow.css'
import { CloseIcon } from "@/components/Icons"

type FormProps = {
    title: string,
    tags?: string[] | [],
    body: string,
    postImage?: File,
    publish: boolean
}

const FormValues: FormProps = {
    title: '',
    tags: [],
    body: '',
    postImage: undefined,
    publish: false
}

async function createOrUpdatePost({ formData, methodType }: { formData: FormData, methodType: 'POST' | 'PUT' }) {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts`, {
        method: methodType,
        body: formData
    })
    return await res.json()
}

function PostForm({ crud, currentUser }: { crud: string, currentUser: SessionUser | undefined }) {

    const router = useRouter()
    const searchParams = useSearchParams()
    const postSlug = searchParams.get('slug')
    const queryClient = useQueryClient()
    const fetchRun = useRef(false)

    const [isLoading, setLoading] = useState(true)
    const [submitType, setSubmitType] = useState<'publish' | 'draft' | null>()
    const [errMsg, setErrMsg] = useState<string | null>('')
    const [postImage, setPostImage] = useState<File>()
    const [showImage, setShowImage] = useState<string>()
    const [validFormat, setValidFormat] = useState<boolean>(true)
    const [fileDrag, setFileDrag] = useState(false)

    const AccountValidationSchema = object({
        title: z.string({ required_error: "Title can't be blank!" }).trim().min(10, { message: 'Title must be 10 or more characters long!' }),
        body: z.string({ required_error: "Body can't be blank!" }).trim().min(20, { message: 'Content too short!' }),
        postImage: z.any().optional()
    })
        .refine((data) => {
            if (postImage && checkFileFormat(postImage)) return true
        }, { message: 'Only .png, .jpg and .jpeg format allowed!' })

    const formikForm = useFormik({
        initialValues: FormValues,
        validationSchema: toFormikValidationSchema(AccountValidationSchema),
        onSubmit: submitForm,
    });

    const addPostMutation = useMutation({
        mutationFn: createOrUpdatePost,
        onSuccess: (postJson, { methodType }) => {
            if (methodType === 'POST' && !postJson?.newPost || methodType === 'PUT' && !postJson?.updatedPost) {
                if (postJson?.error) {
                    setErrMsg(postJson.error)
                } else {
                    setErrMsg("Something went wrong, check your console.")
                }
                formikForm.setSubmitting(false)
                setSubmitType(null)
                return
            }

            const postArticle: UserPost = postJson?.newPost || postJson?.updatedPost
            if (postJson?.newPost) queryClient.setQueryData(['posts', postArticle.authorId], postArticle)
            formikForm.setSubmitting(false)
            setSubmitType(null)
            router.push(`/user/${postArticle?.author.username}`)
        }
    })

    useEffect(() => {

        const quillToolbar = document.querySelector('.ql-toolbar')
        const trixEditorPos = quillToolbar?.getBoundingClientRect()

        function handleScroll() {
            const currentScroll = window.pageYOffset
            if (quillToolbar && trixEditorPos) {
                if (currentScroll >= trixEditorPos.top) {
                    quillToolbar.classList.add('sticky', 'top-16', 'z-50', 'bg-white', 'mx-[1px]', '!border-b-gray-250', 'dark:bg-slate-500')
                } else {
                    quillToolbar.classList.remove('sticky', 'top-16', 'z-50', 'bg-white', 'mx-[1px]', '!border-b-gray-250', 'dark:bg-slate-500')
                }
            }
        }

        document.addEventListener("scroll", handleScroll)

        return () => document.removeEventListener("scroll", handleScroll)
    }, [formikForm.values.body])

    useEffect(() => {
        async function fetchPost() {
            const blogFetch = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/${postSlug}`)
            const postJson = await blogFetch.json()

            if (!postJson.post) {
                setErrMsg(postJson.error)
                setLoading(false)
                return;
            }

            const postData: UserPost = postJson?.post

            await formikForm.setValues({
                title: postData.title,
                body: postData.body,
                tags: postData.tags?.map(tag => tag.name) || [],
                publish: postData.published
            })

            setShowImage(postData?.photo_url || '')
            setLoading(false)
        }

        if (fetchRun.current === true && crud === 'edit') {
            try {
                fetchPost()
            } catch (err: any) {
                setLoading(false)
                setErrMsg(err)
                console.error(err)
            }
        }

        return () => {
            fetchRun.current = true
        }
    }, [crud, postSlug])

    if (!['new', 'edit'].includes(crud) || crud === 'edit' && !postSlug) return notFound()

    async function saveDraft() {
        formikForm.setSubmitting(true)
        setSubmitType('draft')
        handleFormSubmit({ ...formikForm.values, publish: false })
    }

    function submitForm(values: FormProps) {
        setSubmitType('publish')
        handleFormSubmit({ ...values, publish: true })
    }

    function handleFormSubmit(values: FormProps) {

        setErrMsg(null)

        const quillEditor = document.querySelector('.ql-editor')

        const formData = new FormData()
        if (postImage) formData.append('photoUrl', postImage)
        formData.append('title', values.title)
        formData.append('body', values.body)
        formData.append('tags', (values.tags || '').toString())
        formData.append('published', (values.publish).toString())
        formData.append('readTime', postReadingTime(quillEditor?.textContent || '').toString())

        if (crud === 'new') {
            formData.append('slug', createSlug(values.title))
            formData.append('userEmail', currentUser?.email || '')
        } else if (crud === 'edit') {
            formData.append('slug', postSlug || '')
        }

        try {
            const methodType = crud === 'new' ? 'POST' : 'PUT'

            addPostMutation.mutate({
                formData: formData,
                methodType: methodType
            })
        } catch (err) {
            formikForm.setSubmitting(false)
            setSubmitType(null)
            console.error(err)
        }
    }

    const onBodyChange = (value: string) => {
        formikForm.setFieldValue('body', value)
    }

    const handleValidation = (field: string) => {
        formikForm.setFieldTouched(field, true)
    }

    const handleTags = (tags: string[]) => {
        formikForm.setFieldValue('tags', tags)
    }

    const handleDrag = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()

        if (event.type === 'dragenter' || event.type === 'dragover') {
            setFileDrag(true)
        } else if (event.type === 'dragleave') {
            setFileDrag(false)
        }
    }

    const handleDrop = (event: DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.stopPropagation()
        setFileDrag(false)

        const file = event.dataTransfer?.files && event.dataTransfer?.files[0]

        if (file && checkFileFormat(file)) {
            setPostImage(file)
        }
    }

    const checkFileFormat = (file: File) => {
        if (file) {
            if (['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file?.type)) {
                setValidFormat(true)
                return true
            } else {
                setErrMsg('Only .png, .jpg and .jpeg format allowed!')
                setValidFormat(false)
                return false
            }
        }
    }

    const cancelImageUpload = () => {
        setPostImage(undefined)
        setValidFormat(true)
        setErrMsg(null)
    }

    const onImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event?.target.files && event?.target.files[0]
        if (file && checkFileFormat(file)) {
            setPostImage(file)
        }
        // purge input target value to allow upload same file twice
        event.target.value = ''
    }

    return (
        <section className="w-full md:w-3/4 lg:w-2/3 2xl:w-2/4 flex flex-col mx-auto mb-4">
            <div className={errMsg ? 'w-auto alert alert-danger p-4 mx-2 sm:mx-0 my-4 rounded-sm text-center flex justify-between gap-x-2' : 'hidden'} aria-live="assertive">
                {errMsg}
                <div onClick={cancelImageUpload}><CloseIcon /></div>
            </div>

            {crud === 'edit' && isLoading ? <PostFormSkeleton />
                :
                (
                    <form
                        id="post-form"
                        onSubmit={formikForm.handleSubmit}
                        className="relative w-full bg-white dark:bg-navbar-dark dark:text-slate-100 border-t border-b md:border border-gray-200 dark:border-0 shadow-md shadow-slate-200 dark:shadow-none py-4 md:py-8 space-y-4 md:space-y-8"
                    >
                        <h2 className="w-full lg:w-3/4 px-4 lg:px-0 mx-auto text-xl md:text-2xl">
                            {crud === 'new' ? 'New blog post' : 'Edit blog post'}
                        </h2>

                        <div className="flex items-center flex-col px-4 lg:px-0">
                            <div
                                id="drag-drop-container"
                                className={`w-full lg:w-3/4 border-2 ${fileDrag ? 'border-indigo-500 border-dashed' : 'border-gray-250 dark:border-slate-400'} rounded-xl mx-auto mb-4 py-4 px-4 text-center flex flex-col justify-center items-center min-h-[220px]`}
                                onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                            >
                                <UploadImageContainer uploadImage={postImage} valid={validFormat} cancelUpload={cancelImageUpload} />
                                {
                                    crud === 'edit' && !postImage?.name ? (
                                        <label
                                            htmlFor='postImage'
                                            className="flex cursor-pointer justify-center"
                                        >
                                            {showImage &&
                                                <div
                                                    id="post-image"
                                                    className={`min-w-[8rem] h-[10rem] mx-auto bg-white rounded-md border overflow-hidden p-1 while-submitting-form`}
                                                >
                                                    <Image
                                                        alt='Blog Upload Photo'
                                                        src={showImage}
                                                        width={600}
                                                        height={400}
                                                        loading="eager"
                                                        style={{
                                                            objectFit: 'cover',
                                                            objectPosition: 'center',
                                                            borderRadius: '0.5rem',
                                                            width: '100%',
                                                            height: '100%',
                                                        }}
                                                    />
                                                </div>
                                            }
                                        </label>
                                    ) : null
                                }
                                <input id='postImage' hidden type='file' accept='image/png, image/jpeg, image/jpg, image/webp' onChange={onImageUpload} />
                            </div>
                        </div>

                        <div className="flex items-center flex-col text-sm md:text-base">
                            <label htmlFor='title' className='w-full lg:w-3/4 px-4 lg:px-0 mb-1 font-semibold'>Title</label>
                            <div className="relative w-full lg:w-3/4 px-4 lg:px-0">
                                <input
                                    id='title'
                                    name='title'
                                    type='text'
                                    aria-invalid={formikForm.errors.title ? 'true' : 'false'}
                                    aria-describedby="uidnote"
                                    className={'w-full text-sm md:text-base border rounded-md border-gray-300 dark:bg-[#4a5469] dark:text-slate-100 dark:border-slate-400 p-3 text-semibold focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-90 focus:border-transparent dark:focus:border-transparent dark:focus:ring-blue-400'}
                                    onChange={formikForm.handleChange}
                                    onBlur={formikForm.handleBlur}
                                    value={formikForm.values.title}
                                />
                                {formikForm.touched.title && formikForm.errors.title ? (
                                    <span key={`${formikForm.errors.title}`} className='invalid-feedback'>{formikForm.errors.title}</span>
                                ) : null}
                            </div>
                        </div>

                        <div className="flex items-center flex-col text-sm md:text-base">
                            <label className='w-full lg:w-3/4 px-4 lg:px-0 mb-1 font-semibold'>Topics</label>
                            <div className="w-full lg:w-3/4 px-4 lg:px-0">
                                <MultiTagSelect propTags={formikForm.values.tags || []} handleTags={handleTags} />
                            </div>
                        </div>

                        <div className="flex items-center flex-col text-sm md:text-base">
                            <label htmlFor='body' className='w-full lg:w-3/4 px-4 lg:px-0 mb-1 font-semibold'>Content</label>

                            <div className="relative w-full lg:w-3/4 px-4 lg:px-0">
                                <BodyEditor
                                    value={formikForm.values.body}
                                    handleFieldValidation={() => handleValidation('body')}
                                    onValueChange={onBodyChange}
                                    placeholder="Post content here..."
                                />

                                {formikForm.touched.body && formikForm.errors.body ? (
                                    <span key={`${formikForm.errors.body}`} className='invalid-feedback'>{formikForm.errors.body}</span>
                                ) : null}
                            </div>
                        </div>
                        <hr />
                        <div className="flex items-center flex-col mt-8">
                            <div className="w-full lg:w-3/4 flex items-center gap-4 px-4 lg:px-0">
                                <button type="submit" disabled={!formikForm.isValid || submitType === 'draft'}
                                    className={'block px-4 xs:px-5 py-1 xs:py-[6px] md:w-max border-2 border-indigo-400 bg-transparent overflow-hidden dark:bg-indigo-400/20 text-indigo-400 dark:text-indigo-200 rounded-xl font-semibold hover:text-gray-50 hover:bg-indigo-500 dark:hover:bg-indigo-500 hover:border-indigo-500 cursor-pointer duration-150'}>
                                    {
                                        formikForm.isSubmitting && submitType === 'publish' ? (
                                            <span className={
                                                "flex items-center transition ease-in-out duration-150 animate-[loader-show_0.25s] cursor-not-allowed w-full h-auto"
                                            }>
                                                <svg
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4">
                                                    </circle>
                                                    <path
                                                        className="opacity-75"
                                                        fill="currentColor"
                                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                    >
                                                    </path>
                                                </svg>
                                                Saving
                                            </span>
                                        ) : (
                                            <span>Submit</span>
                                        )
                                    }
                                </button>

                                <button
                                    disabled={!formikForm.isValid || submitType === 'publish'}
                                    name="post-draft"
                                    type="button"
                                    onClick={saveDraft}
                                    className={'block px-4 xs:px-5 py-1 xs:py-[6px] md:w-max border-2 border-indigo-400 bg-indigo-400 overflow-hidden dark:bg-indigo-400/20 text-indigo-50 dark:text-indigo-200 rounded-xl font-semibold hover:text-gray-50 hover:bg-indigo-500 dark:hover:bg-indigo-500 hover:border-indigo-500 cursor-pointer duration-150'}>

                                    {
                                        formikForm.isSubmitting && submitType === 'draft' ? (
                                            <span className={
                                                "flex items-center transition ease-in-out duration-150 animate-[loader-show_0.25s] cursor-not-allowed w-full h-auto"
                                            }>
                                                <svg
                                                    width="30"
                                                    height="30"
                                                    viewBox="0 0 30 30"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="animate-spin -ml-1 mr-3 h-5 w-5"
                                                >
                                                    <path d="M18.25 15C18.25 16.795 16.795 18.25 15 18.25C13.205 18.25 11.75 16.795 11.75 15C11.75 13.205 13.205 11.75 15 11.75C16.795 11.75 18.25 13.205 18.25 15Z" stroke="currentColor" />
                                                    <path d="M24.3051 21.3746L24.3051 21.3747L24.3089 21.3785L24.3839 21.4535L24.3841 21.4537C24.7597 21.8289 24.9707 22.3379 24.9707 22.8688C24.9707 23.3996 24.7597 23.9086 24.3841 24.2838L24.3838 24.2841C24.0086 24.6597 23.4996 24.8707 22.9688 24.8707C22.4379 24.8707 21.9289 24.6597 21.5537 24.2841L21.5536 24.2839L21.4786 24.2089L21.4786 24.2089L21.4746 24.2051C20.7265 23.4732 19.6085 23.27 18.6507 23.6914C17.7132 24.0943 17.1041 25.015 17.1 26.0355V26.0375V26.25C17.1 27.3546 16.2046 28.25 15.1 28.25C13.9954 28.25 13.1 27.3546 13.1 26.25V26.1375H13.1001L13.0999 26.1258C13.0754 25.0791 12.4167 24.1532 11.4374 23.7862C10.4823 23.3717 9.37046 23.5762 8.62536 24.3051L8.62534 24.3051L8.62145 24.3089L8.54645 24.3839L8.54627 24.3841C8.17112 24.7597 7.66206 24.9707 7.13125 24.9707C6.60044 24.9707 6.09138 24.7597 5.71623 24.3841L5.71585 24.3837C5.3403 24.0086 5.12928 23.4996 5.12928 22.9688C5.12928 22.4379 5.34031 21.9289 5.71585 21.5538L5.71606 21.5536L5.79106 21.4786L5.79108 21.4786L5.79492 21.4746C6.52681 20.7265 6.73003 19.6085 6.30854 18.6506C5.90565 17.7132 4.98495 17.1041 3.96451 17.1H3.9625H3.75C2.64543 17.1 1.75 16.2046 1.75 15.1C1.75 13.9954 2.64543 13.1 3.75 13.1H3.8625V13.1001L3.87419 13.0999C4.92085 13.0754 5.84675 12.4167 6.21377 11.4374C6.62833 10.4822 6.42376 9.37045 5.69493 8.62537L5.69495 8.62535L5.69105 8.62145L5.61605 8.54645L5.61586 8.54625C5.2403 8.17111 5.02928 7.66206 5.02928 7.13125C5.02928 6.60044 5.2403 6.09139 5.61586 5.71625L5.61625 5.71586C5.99139 5.3403 6.50044 5.12928 7.03125 5.12928C7.56206 5.12928 8.07111 5.3403 8.44625 5.71586L8.44645 5.71605L8.52145 5.79105L8.52143 5.79107L8.52537 5.79493C9.24771 6.50151 10.3147 6.71536 11.2495 6.35H11.25H11.3526L11.447 6.30957C12.3857 5.90722 12.9959 4.98582 13 3.96451V3.9625V3.75C13 2.64543 13.8954 1.75 15 1.75C16.1046 1.75 17 2.64543 17 3.75L17 3.8625L17 3.86451C17.0041 4.88495 17.6132 5.80565 18.5506 6.20854C19.5085 6.63002 20.6265 6.42681 21.3746 5.69492L21.3747 5.69494L21.3786 5.69105L21.4536 5.61605L21.4538 5.61585C21.8289 5.24031 22.3379 5.02928 22.8688 5.02928C23.3996 5.02928 23.9086 5.2403 24.2837 5.61585L24.2841 5.61623C24.6597 5.99138 24.8707 6.50044 24.8707 7.03125C24.8707 7.56206 24.6597 8.07112 24.2841 8.44627L24.2839 8.44644L24.2089 8.52144L24.2089 8.52142L24.2051 8.52536C23.4984 9.24772 23.2847 10.3147 23.65 11.2495V11.25V11.3526L23.6904 11.4469C24.0927 12.3858 25.0141 12.9959 26.0355 13H26.0375H26.25C27.3546 13 28.25 13.8954 28.25 15C28.25 16.1046 27.3546 17 26.25 17L26.1375 17L26.1355 17C25.115 17.0041 24.1943 17.6132 23.7914 18.5507C23.37 19.5085 23.5732 20.6265 24.3051 21.3746Z" stroke="currentColor" />
                                                </svg>

                                                Saving draft
                                            </span>
                                        ) : (
                                            <span>Save as draft</span>
                                        )
                                    }

                                </button>
                            </div>
                        </div>
                    </form>
                )
            }
        </section >
    )
}

export default PostForm