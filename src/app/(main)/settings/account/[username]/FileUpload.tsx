import { useField } from 'formik'
import { forwardRef } from 'react'

interface FormikFileUploadProps {
    name: string
    fileRef?: React.Ref<HTMLInputElement> | null
}

export const FileUpload = forwardRef<HTMLInputElement, FormikFileUploadProps>((props, ref) => {

    const [field, meta] = useField(props)

    return (
        <input
            id='avatarUrl'
            itemRef=''
            ref={ref ? ref : null}
            {...field}
            hidden
            type='file'
            accept='image/png, image/jpeg, image/jpg'
        />
    )
})
