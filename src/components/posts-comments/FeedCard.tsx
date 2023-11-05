import Link from "next/link"
import Image from "next/image"
import { UserAvatar } from "../CoreComponents"
import { formatPostDate } from "@/lib/helperFunctions"
import { HtmlHTMLAttributes, ReactNode, useEffect, useState } from "react"
import { User } from "@/models/User"

interface FeedCardProps {
    children: ReactNode
    compId?: string
}

function randomImageColor() {
    const randomColors =
        ["from-cyan-500 to-blue-500",
            "from-sky-500 to-indigo-500",
            "from-violet-500 to-fuchsia-500",
            "from-purple-500 to-pink-500"]
    return randomColors[Math.floor(Math.random() * randomColors.length)]
}

function FeedArticleCard({ children, compId }: FeedCardProps) {
    return (
        <article key={(compId || '').toString()} className='relative group flex flex-col border-b xs:border-none xs:shadow-article-shadow xs:hover:shadow-article-hover-shadow dark:text-slate-300 dark:shadow-none dark:hover:shadow-none bg-white dark:bg-transparent xs:dark:bg-slate-600 p-2 xs:rounded-xl transition-all'>
            {children}
        </article>
    )
}

function CardLink({ href, title }: { href: string, title?: string }) {
    return <Link href={href} className="absolute opacity-0 left-0 w-full h-full">"Link to post"</Link>
}

function CardImage({ photoUrl, title }: { photoUrl?: string | null, title?: string }) {

    const [randomColor, setRandomColor] = useState('')

    useEffect(() => {
        setRandomColor(randomImageColor())
    }, [])

    return (
        <div className='block h-auto aspect-square w-full max-h-[220px] xs:max-h-max overflow-hidden rounded-lg bg-gray-100'>
            {photoUrl ? (
                <Image
                    src={photoUrl}
                    alt='Post Image'
                    className='object-cover object-center group-hover:opacity-80 w-full h-full'
                    width={400}
                    height={400}
                />
            ) : (
                <div className={
                    `w-full flex justify-center items-center text-center text-white h-full px-2 md:my-0 overflow-hidden bg-gradient-to-r ${randomColor}`
                }>
                    {title}
                </div>
            )}
        </div>
    )
}

function CardBody({ children, className, ...props }: HtmlHTMLAttributes<HTMLDivElement>) {
    return (
        <div className={`flex flex-col justify-between h-3/6 p-2 ${className}`}>
            {children}
        </div>
    )
}

function Title({ children }: { children: ReactNode }) {
    return <h4 className='my-2 w-full line-clamp-2 text-lg xs:text-xl xl:text-[18px] font-medium'>{children}</h4>
}

function ArticleDate({ updatedAt }: { updatedAt?: Date }) {
    return (
        <div className="flex items-center">
            <p className='block text-sm font-medium text-gray-500 dark:text-slate-300 pr-2'>
                {formatPostDate(updatedAt || new Date())}
            </p>
            <hr className="flex-1 dark:border-slate-500" />
        </div>
    )
}

function Combine({ children }: { children: ReactNode }) {
    return <div>{children}</div>
}

function UserInfo({ author }: { author: User }) {
    return (
        <div className="flex items-center gap-1 pt-2 py-2 xs:py-0">
            <UserAvatar
                link={`/user/${author.username}`}
                src={author?.avatarUrl as string || ''}
                linkClass={"max-w-[32px] max-h-[32px]"}
            />

            <Link href={`/user/${author.username}`} className="font-semibold text-sm truncate">
                <span>{author.username as string}</span>
            </Link>
        </div>
    )
}

FeedArticleCard.CardLink = CardLink
FeedArticleCard.CardImage = CardImage
FeedArticleCard.CardBody = CardBody
FeedArticleCard.Title = Title
FeedArticleCard.ArticleDate = ArticleDate
FeedArticleCard.Combine = Combine
FeedArticleCard.UserInfo = UserInfo

export { CardBody, CardImage, CardLink, Combine, ArticleDate, Title, UserInfo }
export default FeedArticleCard;