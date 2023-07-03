import Link from "next/link"
import defaultAvatar from '../../../public/defaultAvatar.png'
import Image from "next/image"

const UserAvatar = ({ src, link, linkClass }: { src?: string, link: string, linkClass?: string }) => {
    return (
        <Link href={link} className={`${linkClass}`}>
            <Image
                alt="User avatar"
                className={`rounded-full object-cover object-center p-[1px] bg-white dark:bg-slate-400 border border-gray-300 `}
                src={src || defaultAvatar.src}
                width={40}
                height={40}
                priority={true}
            />
        </Link >
    )
}

export { UserAvatar }