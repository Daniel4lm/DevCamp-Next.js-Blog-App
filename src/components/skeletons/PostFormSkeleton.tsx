import Skeleton from './Skeleton'

function PostFormSkeleton() {
    return (
        <div className="relative w-full border-t border-b md:border border-gray-200 dark:border-0 shadow-md shadow-slate-200 dark:shadow-none py-4 md:py-8 space-y-4 md:space-y-8">

            <div className='w-full lg:w-3/4 mx-auto'>
                <Skeleton classes='w-32 mx-4 lg:mx-0 h-8' />
            </div>

            <div className="'w-full flex items-center flex-col px-4 lg:px-0">
                <Skeleton classes='w-full lg:w-3/4 border-2 border-gray-250 dark:border-slate-400 rounded-xl mx-auto mb-4 my-4 mx-4 text-center flex flex-col justify-center items-center min-h-[220px]' />
            </div>

            <div className="flex items-center flex-col text-sm md:text-base">
                <div className='w-full lg:w-3/4 mx-4 lg:mx-0 mb-1'>
                    <Skeleton classes='w-20 h-4' />
                </div>
                <Skeleton classes="relative w-full lg:w-3/4 mx-4 lg:mx-0 h-10" />
            </div>
            <div className="flex items-center flex-col text-sm md:text-base">
                <div className='w-full lg:w-3/4 mx-4 lg:mx-0 mb-1'>
                    <Skeleton classes='w-20 h-4' />
                </div>
                <Skeleton classes="relative w-full lg:w-3/4 mx-4 lg:mx-0 h-10" />
            </div>
            <div className="flex items-center flex-col text-sm md:text-base">
                <div className='w-full lg:w-3/4 mx-4 lg:mx-0 mb-1'>
                    <Skeleton classes='w-20 h-4' />
                </div>
                <Skeleton classes="relative w-full lg:w-3/4 mx-4 lg:mx-0 h-24" />
            </div>
        </div>
    )
}

export default PostFormSkeleton