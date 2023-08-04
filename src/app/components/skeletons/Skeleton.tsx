import React from 'react'

function Skeleton({ classes }: { classes: string }) {

    const classNames = `skeleton ${classes} animate-pulse`

    return (
        <div className={classNames}></div>
    )
}

export default Skeleton
