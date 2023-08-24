declare namespace NodeJS {
    export interface ProcessEnv {
        DATABASE_URL: string
        NEXT_PUBLIC_SITE_URL: string
        NEXTAUTH_SECRET: string
        MAILGUN_API_KEY: string
        MAIL_DOMAIN: string
    }
}