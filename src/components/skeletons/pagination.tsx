import Skeleton from './Skeleton'

function PaginationSkeleton() {
    return (
        <section className="grid px-2 grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-6 md:grid-cols-3 xl:gap-x-8 w-full mx-auto">

            {[...Array(6).keys()].map(i => {
                return (
                    <div key={`card-${i}-1`} className='w-full h-[300px] xl:h-[340px] rounded-xl p-2 border-2'>

                        <Skeleton classes='width-100 h-[220px] mb-2' />
                        <hr />
                        <div className="flex flex-col h-3/6 p-2">
                            <Skeleton classes='text width-100 my-1' />
                            <Skeleton classes='text width-100 my-1' />
                        </div>
                    </div>
                )
            })}
        </section>
    )
}

export default PaginationSkeleton