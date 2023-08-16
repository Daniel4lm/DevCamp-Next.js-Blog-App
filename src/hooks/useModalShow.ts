import { useState } from "react"

type UseModalShowReturnType = {
    show: boolean
    setShow: (value: boolean) => void
    onHide: () => void
}

function useModalShow(): UseModalShowReturnType {
    const [show, setShow] = useState(false)

    const handleOnHide = () => {
        setShow(false)
    }

    return {
        show,
        setShow,
        onHide: handleOnHide,
    }
}

export default useModalShow
