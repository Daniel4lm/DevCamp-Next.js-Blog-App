export interface IObjectKeys {
    [key: string]: string | number | boolean | string[] | undefined
}

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/
export const EMAIL_REGEX = /\S+@\S+\.\S+/
export const WEBSITE_REGEX = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-/]))?/

export interface ValidationTypes {
    [key: string]: {
        isValid: (value: string) => boolean;
        message: string;
    }[]
}

const basicValidation = (value: string) => !!value

const USER_CHANGESET_VALIDATION: ValidationTypes = {
    email: [
        {
            isValid: basicValidation,
            message: "Email can't be blank!"
        },
        {
            isValid: (value: string) => EMAIL_REGEX.test(value),
            message: 'Needs to be valid email.'
        }
    ],
    website: [
        {
            isValid: (value: string) => WEBSITE_REGEX.test(value),
            message: 'Needs to be valid webpage URL.'
        }
    ],
    fullName: [
        {
            isValid: basicValidation,
            message: "Full name can't be blank!"
        }
    ],
    username: [
        {
            isValid: basicValidation,
            message: "Usename can't be blank!"
        }
    ],
    password: [
        {
            isValid: basicValidation,
            message: 'Password is required!'
        },
        {
            isValid: (value: string) => PWD_REGEX.test(value),
            message: 'Password needs to be valid.'
        }
    ]
}

const POST_CHANGESET_VALIDATION: ValidationTypes = {
    title: [
        {
            isValid: basicValidation,
            message: "Title can't be blank!"
        }
    ],
    body: [
        {
            isValid: (value: string) => value !== '<p><br></p>',
            message: "Body can't be blank!"
        }
    ]
}

export const formChangesetValidation = (formInstance: IObjectKeys, fieldName: string, type: 'form' | 'user'): ValidationTypes => {

    let formValidation: ValidationTypes;
    if (type === 'form') {
        formValidation = POST_CHANGESET_VALIDATION
    } else {
        formValidation = USER_CHANGESET_VALIDATION
    }

    return Object.keys(formInstance)
        .filter(field => field === fieldName)
        .reduce((acc, field) => {
            if (!formValidation[field]) return acc

            const validationsPerField = formValidation[field]
                .map((validation) => {
                    return {
                        valid: validation.isValid(formInstance[field] as string),
                        message: validation.message
                    }
                })
                .filter((validation) => !validation.valid)

            return { ...acc, [field]: validationsPerField }
        }, {})
}

export const displayWebsiteUri = (website: string) => {
    return website.replace('https://', '').replace('http://', '')
}
