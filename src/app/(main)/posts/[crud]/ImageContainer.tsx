import { CloseUploadIcon, DeleteIcon, UnsupportedIcon, UploadImage } from '@/components/Icons'
import React from 'react'

function UploadImageContainer({ uploadImage, valid, cancelUpload }: { valid: boolean, uploadImage?: File, cancelUpload: () => void }) {

    return (
        <>
            {
                !uploadImage?.name
                    ?
                    (
                        <div
                            id="upload-image"
                            className="relative py-4 mx-4"
                        >
                            <p className="drag-sub-el font-bold text-md md:text-xl mb-3">
                                Upload your image
                            </p>
                            <p className="drag-sub-el text-sm md:text-base font-light text-gray-500 dark:text-gray-50">
                                Your file must be in JPG or PNG format
                            </p>
                            <label htmlFor='postImage' className="flex cursor-pointer justify-center my-8 text-[#7B8DE1]">
                                {valid ?
                                    <UploadImage />
                                    :
                                    <UnsupportedIcon />
                                }
                            </label>
                            <p className="drag-sub-el text-sm md:text-base font-light text-gray-500 dark:text-gray-50">
                                Drag and drop or browse to choose a file
                            </p>
                        </div>
                    )
                    :
                    (
                        <div className="relative flex flex-col items-center py-4 mx-4">
                            <div>
                                <p className="w-max text-base text-center mx-auto">
                                    Image selected:
                                </p>
                            </div>
                            <div className="flex justify-center">
                                <label
                                    htmlFor='postImage'
                                    className="flex cursor-pointer justify-center may-2"
                                >
                                    {valid ?
                                        <div
                                            id="post-image"
                                            className={`relative min-w-[8rem] h-[8rem] mx-auto bg-white rounded-lg p-1 while-submitting-form`}
                                        >
                                            <img src={uploadImage ? URL.createObjectURL(uploadImage) : ''} className="w-full h-full rounded-lg object-cover object-center" />
                                            <div
                                                id="cancel-image-upload"
                                                onClick={cancelUpload}
                                                className="absolute -top-2 -right-2 w-8 h-8 bg-rose-500 opacity-80 text-slate-100 cursor-pointer rounded-md flex justify-center items-center
                                                    hover:opacity-100 hover:transition-all hover:duration-[600] hover:ease-in-out text-[1rem]"
                                            >
                                                <DeleteIcon />
                                            </div>
                                        </div>
                                        :
                                        <UnsupportedIcon />
                                    }

                                </label>
                            </div>
                            <div className="my-2 relative flex items-center px-4 py-[0.2rem] rounded-2xl bg-indigo-200 dark:bg-slate-500 text-slate-700">
                                <span className="break-all text-[0.9rem]">
                                    {uploadImage?.name}
                                </span>
                            </div>
                        </div>
                    )
            }
        </>
    )

}

export default UploadImageContainer