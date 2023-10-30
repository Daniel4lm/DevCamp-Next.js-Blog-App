import { getServerSession } from "next-auth"
import PostForm from "./Form"
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions"

type PageProps = {
    params: {
        crud: string
    }
}

export default async function PostFormPage({ params }: PageProps) {

    const { crud } = params
    const session = await getServerSession(authOptions)

    return (
        <>
            <PostForm crud={crud} currentUser={session?.user} />
        </>
    )
}
