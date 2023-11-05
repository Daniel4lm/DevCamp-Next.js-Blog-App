import { copyPostUrl, createSlug, getURL, mergeUrlParams, postReadingTime, timeAgo } from "../helperFunctions"

// const originalLocation = window

// afterEach(() => {
//     Object.defineProperty(globalThis, 'window', {
//         value: originalLocation,
//     })
// })

describe('createSlug', () => {

    it('Should not create post slug', () => {
        const postSlug = createSlug('')

        expect(postSlug).toBe('')
    })

    it('Should create regular post slug', () => {
        const postSlug = createSlug('Next.js 13 release')

        expect(postSlug).toBe('next-js-13-release')
    })
})

describe('timeAgo', () => {

    it('Should display few seconds ago', () => {
        const date = timeAgo(new Date())

        expect(date).toBe('a few seconds ago')
    })

    it('Should display last year', () => {
        let date = new Date()
        date.setFullYear(date.getFullYear() - 1)
        const result = timeAgo(date)

        expect(result).toMatch(/a year ago/i)
    })

})

describe('postReadingTime', () => {
    it('Should return 1', () => {
        let readTime = postReadingTime('Some short text here...')

        expect(readTime).toBe(1)
    })

    it('Should return more than 0', () => {
        let readTime = postReadingTime(
            `<p>You've built an amazing new product. The code is elegant, the interface intuitive. You launch it with pride!</p>
            <br>
            <p>But then...tumbleweeds. Crickets. Where are all the users?</p>
            <br>
            <p>As developers, we excel at building products but often neglect marketing them. Let's change that!</p>

            <p>
                Query invalidation is an essential part while working with React-Query. Usually, when there is a mutation in the app, 
                there are queries related, and when a mutation succeeded, we need to invalidate the related queries, so we can fetch 
                the last query including the last data from the mutation.
            </p>

            <p>
                CSS layout shifts refer to the unexpected movement (or shifting) of elements within the layout of a webpage during 
                the rendering process. This occurs when the dimensions or positions of elements change, causing content to reflow or 
                shift on the page. Layout shifts can lead to poor UX, as the movement may disrupt user interaction or make the content 
                difficult to read or access.
            </p>

            <p>
                The CSS ch unit is a relative length unit that represents the width of the "0" (zero) character in the chosen font. 
                It is primarily used to create responsive designs that scale with the font size.
                The ch unit allows us to define element widths or spacing relative to the width of the "0" character, which is typically 
                a monospaced character, meaning it occupies the same amount of space as other characters in the font.
                In monospace, or fixed-width, fonts like Courier, where all characters are the same width, the ch unit works as an exact 
                measurement. That is, 1ch equals one character. In proportional, or variable-width, fonts like Georgia, any given character 
                could be wider or narrower than the “0” character.
            </p>
            `
        )

        expect(readTime).toBeGreaterThan(1)
    })
})

describe('getURL', () => {

    it('should test url origin', () => {
        // Object.defineProperty(window, 'location', {
        //     value: { origin: 'http://localhostic' },
        //     writable: true,
        // })

        expect(getURL('/dashboard')).toBe('http://localhost/dashboard')
    })
})

describe('mergeUrlParams', () => {
    it('Should return empty url query', () => {
        const mergedQuery = mergeUrlParams({})
        expect(mergedQuery).toBe('')
    })

    it('Should return merged url query', () => {
        const mergedQuery = mergeUrlParams({
            title: 'Oblivion',
            type: 'movie'
        })
        expect(mergedQuery).toBe('title=Oblivion&type=movie')
    })

    it('Should filter empty/nullish fields', () => {
        const mergedQuery = mergeUrlParams({
            title: '',
            type: 'movie'
        })
        expect(mergedQuery).toBe('type=movie')
    })
})


describe('copyPostUrl', () => {
    
    jest.useFakeTimers()
    jest.spyOn(global, 'setTimeout')

    it('Should copy text to clipboard', async () => {
        const setFunc = jest.fn().mockName("clipboard set function")

        Object.defineProperty(navigator, "clipboard", {
            value: {
                writeText: jest.fn().mockImplementation(() => Promise.resolve())
            },
        })

        copyPostUrl('Next.js 13', setFunc)

        await Promise.resolve()
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Next.js 13')
        expect(setFunc).toHaveBeenCalledTimes(1)

        jest.runOnlyPendingTimers()
        await Promise.resolve()
        expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 4000)
        expect(setTimeout).toHaveBeenCalledTimes(1)
        expect(setFunc).toHaveBeenCalledTimes(2)
    })
})