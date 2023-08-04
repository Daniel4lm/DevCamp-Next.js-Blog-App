import { RefObject, useEffect } from 'react'

type Event = MouseEvent | TouchEvent

const useOutsideClick = <T extends HTMLElement = HTMLElement>(elemRef: RefObject<T> | null, callbackFunc: () => void) => {

    useEffect(() => {
        const handleClick = (event: Event) => {
            if (elemRef?.current) {
                if (elemRef?.current?.contains((event?.target as Node) || null)) {
                    return
                }
                callbackFunc()
            }
        };

        document.addEventListener('click', (e) => handleClick(e))

        return () => {
            document.removeEventListener('click', handleClick)
        };
    }, [elemRef, callbackFunc])
};

export default useOutsideClick
