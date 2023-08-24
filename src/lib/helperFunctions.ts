import { genSaltSync, hashSync } from "bcryptjs"
import isBrowser from "./isBrowser"
import dayjs from 'dayjs'
import relativeTime from "dayjs/plugin/relativeTime"

export function createSlug(title: string) {
    return title.toLowerCase()
        .trim()
        .replaceAll(/[^a-zA-Z0-9 &]/g, '')
        .replaceAll("&", "and")
        .replaceAll(/(\s{1,})/g, " ")
        .split(' ')
        .join('-')
}

export function formatPostDate(datetime: Date) {
    let [dayName, monthName, day, year] = new Date(datetime).toDateString().split(/\s/)
    return `${monthName} ${day}, ${year}`
}

export function timeAgo(postDate: string | number | Date | dayjs.Dayjs | null | undefined) {
    dayjs.extend(relativeTime)
    return dayjs(postDate).fromNow()
}

export function postReadingTime(innerText: string) {
    const avgWordsPerMin = 250
    const wordsCount = innerText.trim().split(/\s+/).length
    return Math.ceil(wordsCount / avgWordsPerMin)
}

export function getURL(path: string) {
    const baseURL = !isBrowser ? process.env.NEXT_PUBLIC_SITE_URL : window.location.origin
    return new URL(path, baseURL).toString();
}

export function mergeUrlParams(options: {}) {
    return Object.keys(options)
        .filter(field => !!options[field as keyof {}])
        .reduce((acc, field, index) => {
            const divider = index > 0 ? '&' : ''
            return `${acc}${divider}${field}=${options[field as keyof {}]}`
        }
            , "")
}

export async function copyPostUrl(text: string, setFunc?: (val: boolean) => void) {

    if ('clipboard' in navigator) {
        try {
            await navigator.clipboard.writeText(text)
            setFunc && setFunc(true)
        } catch (err) {
            console.error('Failed to copy url: ', err)
        } finally {
            setTimeout(() => {
                setFunc && setFunc(false)
            }, 4000)
        }
    }
}

export function encryptPassword(receivedPassword: string) {
    let saltRounds = 10
    let salt = genSaltSync(saltRounds)
    return hashSync(receivedPassword, salt)
}