import { Field, useField } from "formik"

interface FormikTextAreaProps {
  label?: string
  name: string
  value?: string | number
  rows?: number
}

export default function FormikTextArea({ label, ...props }: FormikTextAreaProps) {

  const [field, meta] = useField(props)

  return (
    <>
      <label htmlFor={props.name} className='md:w-1/3 pl-4 xs:pl-8 mb-1 md:p-2 md:m-0 md:text-right'>{label}</label>
      <div className="relative w-full pl-4 xs:pl-8 pr-4 xs:pr-8">
        <Field as="textarea"
          className={'w-full text-sm md:text-base rounded p-2 border border-neutral-300 dark:bg-gray-700 dark:text-slate-100 dark:border-slate-500 text-semibold text-gray-600 focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-90 focus:border-transparent dark:focus:border-transparent dark:focus:ring-blue-400'}
          {...props}
          {...field}
        />
        {meta.touched && meta.error ? (
          <span key={`${meta.error}`} className='invalid-feedback'>{meta.error}</span>
        ) : null}
      </div>
    </>
  )
}
