import { useEffect, useState } from 'react'

interface LocalType {
    [key: string]: string | number | boolean | string[]
}

function getLocalStorageItem(item: string, initValue: LocalType | (() => void)) {
    // Server Side Rendering
    if (typeof window === 'undefined') {
        return initValue
    }
    // Already have item in local storage
    let localStorageItem = localStorage.getItem(item)
    const alreadyItem = localStorageItem && JSON.parse(localStorageItem)
    if (alreadyItem) return alreadyItem

    if (typeof initValue === 'function') {
        return initValue()
    }

    return initValue;
}

function useLocalStorage(item: string, initValue: LocalType | (() => void)) {
    const [value, setValue] = useState(() => {
        return getLocalStorageItem(item, initValue)
    });

    useEffect(() => {
        localStorage.setItem(item, JSON.stringify(value))
    }, [item, value])

    return [value, setValue]
}

export default useLocalStorage
