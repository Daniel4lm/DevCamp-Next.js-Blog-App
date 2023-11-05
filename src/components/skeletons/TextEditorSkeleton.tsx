import Skeleton from './Skeleton'

function TextEditorSkeleton() {
    return (
        <div className='relative w-full h- rounded-lg border bg-white dark:bg-slate-400 border-gray-200 dark:border-slate-500 p-1'>
            <div className='p-1 w-full'>
                <Skeleton classes='w-1/2 h-6 mb-2' />
                <Skeleton classes='w-2/3 h-8' />
            </div>
            <hr className="mb-1 dark:border-slate-500" />
            <Skeleton classes='w-full h-28 mb-1' />
        </div>
    )
}

export default TextEditorSkeleton
