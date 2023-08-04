import { CloseUploadIcon, UnsupportedIcon, UploadImage } from '@/app/components/Icons'
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
                        <div className="relative py-4 mx-4">
                            <div className="flex justify-center">
                                <label
                                    htmlFor='postImage'
                                    className="flex cursor-pointer justify-center mb-8"
                                >
                                    {valid ?
                                        <div
                                            id="post-image"
                                            className={`min-w-[8rem] h-[8rem] mx-auto bg-white rounded-md border overflow-hidden p-1 while-submitting-form`}
                                        >
                                            <img src={uploadImage ? URL.createObjectURL(uploadImage) : ''} className="w-full h-full object-cover object-center" />
                                        </div>
                                        :
                                        <UnsupportedIcon />
                                    }

                                </label>
                            </div>
                            <div>
                                <p className="w-max text-base text-center mx-auto">
                                    Image selected:
                                </p>
                            </div>
                            <div className="w-max mx-auto my-2 relative flex items-center pl-4 py-[0.2rem] pr-2 rounded-2xl sm:rounded-full bg-indigo-400 dark:bg-slate-500 text-white">
                                <label className="text-[0.9rem]">
                                    {uploadImage?.name}
                                </label>
                                <div
                                    id="cancel-image-upload"
                                    onClick={cancelUpload}
                                    className="w-[1.1rem] h-[1.1rem] opacity-80 text-white cursor-pointer ml-2 rounded-full flex justify-center items-center
                                                    hover:opacity-100 hover:transition-all hover:duration-[600] hover:ease-in-out text-[1.1rem]"
                                >
                                    <CloseUploadIcon />
                                </div>
                            </div>
                        </div>
                    )
            }
        </>
    )

}

export default UploadImageContainer