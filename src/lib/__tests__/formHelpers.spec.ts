import { displayWebsiteUri } from "../formHelpers"

it('Should not display correct website URL', () => {
    const websiteURL = displayWebsiteUri('')

    expect(websiteURL).toBeNull()
})

it('Should display correct website URL', () => {
    const websiteURL = displayWebsiteUri('https://github.com/Daniel4lm')

    expect(websiteURL).not.toMatch(/https/i)
    expect(websiteURL).toBe('github.com/Daniel4lm')
})