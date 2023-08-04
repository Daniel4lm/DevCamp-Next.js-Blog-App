import Link from "next/link"
import defaultAvatar from '../../../public/defaultAvatar.png'
import Image from "next/image"
import { AvatarIcon } from "./Icons"

const UserAvatar = ({ src, link, linkClass }: { src?: string, link: string, linkClass?: string }) => {
    return (
        <Link href={link} className={`${linkClass}`}>
            {
                !src || src === 'undefined' ? (
                    <AvatarIcon styleClass={'rounded-full w-full h-full object-cover object-center p-[1px] bg-white dark:bg-slate-400 border border-gray-300'} />
                ) :
                    (
                        <Image
                            alt="User avatar"
                            className={`rounded-full w-full h-full object-cover object-center p-[1px] bg-white dark:bg-slate-400 border border-gray-300 `}
                            src={(src !== 'undefined' ? src : defaultAvatar.src) || defaultAvatar.src}
                            width={60}
                            height={60}
                            priority={true}
                        />
                    )
            }
        </Link >
    )
}

export { UserAvatar }