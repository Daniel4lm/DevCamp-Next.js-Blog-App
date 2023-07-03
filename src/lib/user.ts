import prismaClient from '@/lib/db/prismaClient'

let UserTask = {
    getUser: async function (username: string) {
        return await prismaClient.user.findUnique({
            where: { username: username },
            select: {
                id: true,
                avatarUrl: true,
                email: true,
                username: true,
                fullName: true,
                postsCount: true,
                profile: true,
                posts: {
                    include: {
                        author: true,
                        tags: true
                    }
                }
            }
        })
    }
}

export default UserTask