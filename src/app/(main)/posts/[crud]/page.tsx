"use client"

import { ChangeEvent, DragEvent, FormEvent, useEffect, useState } from "react"
import { notFound, useRouter, useSearchParams } from 'next/navigation'
import { useParams } from "next/navigation"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formChangesetValidation, ValidationTypes } from '@/lib/formHelpers'
import MultiTagSelect from '@/app/components/MultiTagSelect'
import { createSlug, postReadingTime } from '@/lib/helperFunctions'
import { Post } from '@/app/models/Post'
import UploadImageContainer from "./ImageContainer"
import dynamic from "next/dynamic"
import Image from "next/image"
const BodyEditor = dynamic(() => import("@/app/components/ContentEditor"), { ssr: false });
import 'react-quill/dist/quill.snow.css'

type FormProps = {
    title: string,
    tags: string[] | [],
    body: string
}

const INITIAL_VALUE: FormProps = {
    title: '',
    tags: [],
    body: ''
}

async function createOrUpdatePost({ formData, methodType }: { formData: FormData, methodType: string }) {

    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/`, {
        method: methodType,
        body: formData
    })
    // await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate?path=/`)
    return await res.json()
}

function PostForm() {

    const { crud } = useParams()
    const router = useRouter()
    const searchParams = useSearchParams()
    const postSlug = searchParams.get('slug')
    const queryClient = useQueryClient()

    const [postData, setPostData] = useState<FormProps>(INITIAL_VALUE)
    const [errorFields, setErrorFields] = useState<ValidationTypes>({})
    const [isSaving, setSaving] = useState(false)
    const [errMsg, setErrMsg] = useState<string | null>('')
    const [postImage, setPostImage] = useState<File>()
    const [showImage, setShowImage] = useState<string>()
    const [validFormat, setValidFormat] = useState<boolean>(true)
    const [fileDrag, setFileDrag] = useState(false)

    const addPostMutation = useMutation({
        mutationFn: createOrUpdatePost,
        onSuccess: (postJson, { methodType }) => {
            console.log('response...', postJson)
            if (methodType === 'POST' && !postJson?.newPost || methodType === 'PUT' && !postJson?.updatedPost) {
                if (postJson?.error) {
                    setErrMsg(postJson.error)
                } else {
                    setErrMsg("Something went wrong, check your console.")
                }
                setSaving(false)
                return
            }

            const postArticle: Post = postJson?.newPost || postJson?.updatedPost
            if (postJson?.newPost) queryClient.setQueryData(['posts', postArticle.authorId], postArticle)
            router.push(`/user/${postArticle?.author.username}`)
            setSaving(false)
        }
    })

    useEffect(() => {

        const quillToolbar = document.querySelector('.ql-toolbar')
        const trixEditorPos = quillToolbar?.getBoundingClientRect()

        function handleScroll() {
            const currentScroll = window.pageYOffset
            if (quillToolbar && trixEditorPos) {
                if (currentScroll >= trixEditorPos.top) {
                    quillToolbar.classList.add('sticky', 'top-16', 'z-50', 'bg-white', 'border-b', 'border-gray-500', 'dark:bg-slate-500')
                } else {
                    quillToolbar.classList.remove('sticky', 'top-16', 'z-50', 'bg-white', 'border-b', 'border-gray-500', 'dark:bg-slate-500')
                }
            }
        }

        document.addEventListener("scroll", handleScroll)

        return () => document.removeEventListener("scroll", handleScroll)
    }, [postData.body])

    useEffect(() => {
        console.log(process.env.NEXT_PUBLIC_SITE_URL)
        async function fetchPost() {
            const blogFetch = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/posts/${postSlug}`)
            const postJson = await blogFetch.json();

            if (!postJson.post) {
                setErrMsg(postJson.error)
                return;
            }

            const postData: Post = postJson?.post;
            setPostData({
                title: postData.title,
                body: postData.body,
                tags: postData.tags?.map(tag => tag.name) || []
            })

            setShowImage(postData.photo_url)
        }

        crud === 'edit' && fetchPost()
    }, [crud, postSlug])

    if (!['new', 'edit'].includes(crud) || crud === 'edit' && !postSlug) return notFound()

    const handleFormChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.currentTarget
        setPostData((prevFormData: any) => ({ ...prevFormData, [name]: value }))
    }

    const onBodyChange = (value: string) => {
        setPostData((prevFormData: any) => ({ ...prevFormData, body: value }))
    }

    const handleValidation = (field: string) => {
        if (postData[field as keyof typeof postData] != null) {
            setErrorFields({ ...errorFields, ...formChangesetValidation(postData, field, 'form') })
        }
    }

    const handleTags = (tags: string[]) => {
        setPostData({ ...postData, tags: tags })
    }

    const handleFormSubmit = async (event: FormEvent) => {
        event.preventDefault()

        const quillEditor = document.querySelector('.ql-editor')
        const hasErrors = Object.values(errorFields).flat().length > 0

        if (postData.title === '' || ['', '<p><br></p>'].includes(postData.body) || hasErrors) {
            setErrMsg('We have some invalid fields!')
            return
        }

        setErrMsg(null)

        const formData = new FormData()
        formData.append('photoUrl', postImage as File)
        formData.append('title', postData.title)
        formData.append('body', postData.body)
        formData.append('tags', postData.tags.toString())
        console.log(postData.tags.toString())
        formData.append('readTime', postReadingTime(quillEditor?.textContent || '').toString())

        if (crud === 'new') {
            formData.append('slug', createSlug(postData.title))
            formData.append('userEmail', 'daniel@gmail.com')
        } else if (crud === 'edit') {
            formData.append('slug', postSlug || '')
        }

        try {
            setSaving(true)
            const methodType = crud === 'new' ? 'POST' : 'PUT'

            addPostMutation.mutate({
                formData: formData,
                methodType: methodType
            })
        } catch (err) {
            console.error(err)
        }
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
            if (['image/png', 'image/jpeg', 'image/jpg'].includes(file?.type)) {
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
        setErrMsg(null)
        setSaving(false)
    }

    const onImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event?.target.files && event?.target.files[0]
        console.log(file)
        if (file && checkFileFormat(file)) {
            setPostImage(file)
        }
    }

    return (
        <section className="w-full md:w-3/4 lg:w-2/3 2xl:w-2/4 flex flex-col mx-auto mb-4">
            <div className={errMsg ? 'w-auto alert alert-danger p-4 m-4 rounded-sm text-center' : 'hidden'} aria-live="assertive">{errMsg}</div>

            <form
                id="post-form"
                onSubmit={handleFormSubmit}
                className="relative w-full bg-white dark:bg-navbar-dark dark:text-slate-100 border-t border-b md:border border-gray-200 dark:border-0 shadow-md shadow-slate-200 dark:shadow-none py-4 md:py-8 space-y-4 md:space-y-8"
            >
                <h2 className="w-full lg:w-3/4 px-4 lg:px-0 mx-auto text-xl md:text-2xl">
                    {crud === 'new' ? 'New blog post' : 'Edit blog post'}
                </h2>

                <div className="flex items-center flex-col px-4 lg:px-0">
                    <div
                        id="drag-drop-container"
                        className={`w-full lg:w-3/4 border-2 ${fileDrag ? 'border-indigo-500 border-dashed' : 'border-gray-250 dark:border-slate-400'}  rounded-xl mx-auto mb-4 py-4 px-4 text-center flex flex-col justify-center items-center min-h-[220px]`}
                        onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
                    >
                        <UploadImageContainer uploadImage={postImage} valid={validFormat} cancelUpload={cancelImageUpload} />
                        {
                            crud === 'edit' && !postImage?.name && (
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
                            )
                        }
                        <input id='postImage' hidden type='file' accept='image/png, image/jpeg, image/jpg' onChange={onImageUpload} />
                    </div>
                </div>

                <div className="flex items-center flex-col text-sm md:text-base">
                    <label htmlFor='title' className='w-full lg:w-3/4 px-4 lg:px-0 mb-1 font-semibold'>Title</label>
                    <div className="relative w-full lg:w-3/4 px-4 lg:px-0">
                        <input
                            id='title-field'
                            name='title'
                            type='text'
                            aria-invalid={errorFields.title?.length > 0 ? 'true' : 'false'}
                            aria-describedby="uidnote"
                            className={'w-full text-sm md:text-base border rounded-md border-gray-300 dark:bg-[#4a5469] dark:text-slate-100 dark:border-slate-400 p-3 text-semibold focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-90 focus:border-transparent dark:focus:border-transparent dark:focus:ring-blue-400'}
                            onChange={handleFormChange}
                            onBlur={() => handleValidation('title')}
                            value={postData?.title}
                        />
                        {errorFields?.title?.length > 0 && (
                            errorFields?.title?.map((error, i) => (
                                <span key={`${error.message}-${i}`} className='invalid-feedback'>{error.message}</span>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex items-center flex-col text-sm md:text-base">
                    <label className='w-full lg:w-3/4 px-4 lg:px-0 mb-1 font-semibold'>Topics</label>
                    <div className="w-full lg:w-3/4 px-4 lg:px-0">
                        <MultiTagSelect propTags={postData.tags} handleTags={handleTags} />
                    </div>
                </div>
                <div className="flex items-center flex-col text-sm md:text-base">
                    <label htmlFor='body' className='w-full lg:w-3/4 px-4 lg:px-0 mb-1 font-semibold'>Content</label>

                    <div className="relative w-full lg:w-3/4 px-4 lg:px-0">
                        <BodyEditor
                            value={postData.body}
                            onValueChange={onBodyChange}
                            handleFieldValidation={() => handleValidation('body')}
                            placeholder="Post content here..."
                        />

                        {errorFields?.body?.length > 0 && (
                            errorFields?.body?.map((error, i) => (
                                <span key={`${error.message}-${i}`} className='invalid-feedback'>{error.message}</span>
                            ))
                        )}
                    </div>
                </div>

                <div className="flex items-center flex-col mt-8">
                    <div className="w-full lg:w-3/4 px-4 lg:px-0">
                        <button type="submit" disabled={errorFields?.title?.length > 0 || errorFields?.body?.length > 0}
                            className={'block px-8 w-full py-2 md:w-max border-none shadow rounded-full font-semibold text-sm text-gray-50 hover:bg-indigo-500 bg-indigo-400 cursor-pointer'}>
                            {isSaving ? 'Saving...' : 'Submit'}
                        </button>
                    </div>
                </div>
            </form>
        </section >
    )
}

export default PostForm