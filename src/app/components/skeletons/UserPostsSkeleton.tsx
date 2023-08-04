import React from 'react'
import Skeleton from './Skeleton'

function UserPostsSkeleton() {
    return (
        <section className="w-full sm:w-10/12 md:w-2/3 xl:w-3/6 min-h-[45vh] dark:text-slate-100 mx-auto px-4 md:px-0 pb-8 mb-1 mt-6 sm:mt-0">

            <Skeleton classes='title width-50 my-4' />
            <div className='border rounded-xl xs:shadow p-3'>
                <Skeleton classes='title width-50 my-3' />
                {[...Array(4).keys()].map(i => {
                    return (<Skeleton key={`card-${i}-1`} classes='text width-100 my-1' />)
                })}
            </div>
        </section>
    )
}

export default UserPostsSkeleton
