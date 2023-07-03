import prismaClient from '@/lib/db/prismaClient'
import { Comment, Post, Tag, User } from '@prisma/client'

function paginationQuery(take: number, skip: number) {
    return {
        where: {},
        include: {
            comments: true,
            tags: true,
            author: {
                select: excludeUserFields(['hashedPassword', 'refreshToken', 'posts'])
            },
        },
        take: take,
        skip: skip
    }
}

let PostTask = {
    getNumOfRecords: async function () {
        return await prismaClient.post.aggregate({
            _count: { id: true }
        })
    },
    getNumOfUserPosts: async function (username: string) {
        return await prismaClient.post.aggregate({
            where: {
                author: {
                    username: username
                }
            },
            _count: { id: true }
        })
    },
    getNumOfTagPosts: async function (tag: string) {
        return await prismaClient.post.aggregate({
            where: {
                tags: {
                    some: {
                        name: tag
                    }
                }
            },
            _count: { id: true }
        })
    },
    getPostsByTag: async function (take: number, skip: number, tag: string) {
        let query = {
            where: {
                tags: {
                    some: {
                        name: tag
                    }
                }
            },
            include: {
                comments: true,
                tags: true,
                author: {
                    select: excludeUserFields(['hashedPassword', 'refreshToken', 'posts'])
                },
            },
            take: take,
            skip: skip
        }
        return await prismaClient.post.findMany(query)
    },
    getPaginatedPosts: async function (take: number, skip: number, username?: string) {

        let query = paginationQuery(take, skip)

        if (username) {
            query = {
                ...query,
                where: { author: { username: username } }
            }
        }

        return await prismaClient.post.findMany(query)
    },
    getPostSlugs: async function () {
        return await prismaClient.post.findMany({
            select: { slug: true },
            orderBy: { slug: 'asc' }
        })
    },
    createComment: async function (content: string, authorId: string, postId: string, replyId?: string) {
        console.log('crete new or reply...')
        console.log(authorId, postId, replyId)

        let queryData = {
            content: content,
            author: {
                connect: { id: authorId }
            },
            post: {
                connect: { id: postId }
            },
            reply: {}
        }

        if (replyId) {
            queryData = {
                ...queryData,
                reply: {
                    connect: { id: replyId }
                }
            }
        }

        const comment = await prismaClient.comment.create({
            data: queryData,
            include: {
                author: {
                    select: excludeUserFields(['hashedPassword', 'refreshToken'])
                },
                post: true
            }
        })

        await prismaClient.post.update({
            where: {
                id: postId
            },
            data: {
                totalComments: { increment: 1 }
            }
        })

        return comment
    },
    updateComment: async function (data: any) {

        return await prismaClient.comment.update({
            where: {
                id: data.id
            },
            data: { ...data },
            include: {
                author: {
                    select: excludeUserFields(['hashedPassword', 'refreshToken'])
                },
                post: true
            }
        })
    },
    getAllPostComments: async function (postId: string) {
        return await prismaClient.comment.findMany({
            where: {
                postId: postId
            },
            include: {
                author: {
                    select: excludeUserFields(['hashedPassword', 'refreshToken'])
                },
                post: true,
                reply: true,
                replies: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
    },
    maybeCreateNewTags: async function (postTags: { name: string }[]) {
        return await prismaClient.tag.createMany({
            data: postTags,
            skipDuplicates: true
        })
    },
    createNewPost: async function (data: any, tags: string[] = [], userEmail: string) {

        const postTags = tags.map((tag: string) => {
            return { name: tag }
        })

        const maybeNewTags = await this.maybeCreateNewTags(postTags)

        const readTimeData = Number(data.readTime as string)
        const dbData = { ...data, ...{ readTime: readTimeData } }

        const createPost = await prismaClient.post.create({
            data: {
                tags: {
                    connect: postTags,
                },
                author: { connect: { email: userEmail } },
                ...dbData
            },
            include: {
                author: {
                    select: excludeUserFields(['hashedPassword', 'refreshToken'])
                },
                tags: true
            }
        })

        await prismaClient.user.update({
            where: {
                email: userEmail
            },
            data: {
                postsCount: { increment: 1 }
            }
        })

        return createPost
    },
    updatePost: async function (data: any, tags: string[] = [], oldSlug: string) {
        const postTags = tags.map((tag: string) => {
            return { name: tag }
        })

        const maybeNewTags = await this.maybeCreateNewTags(postTags)

        const readTimeData = Number(data.readTime as string)
        const dbData = { ...data, ...{ readTime: readTimeData } }

        const allPostTags = await prismaClient.tag.findMany({
            where: {
                posts: {
                    some: { slug: oldSlug }
                }
            }, select: { name: true }
        })

        return await prismaClient.post.update({
            where: {
                slug: oldSlug
            },
            data: {
                tags: {
                    disconnect: allPostTags,
                    connect: postTags,
                },
                ...dbData
            },
            include: {
                author: {
                    select: excludeUserFields(['hashedPassword', 'refreshToken'])
                },
                tags: true
            }
        })
    },
    deletePost: async function (postId: string) {

        const deletedPost = await prismaClient.post.delete({
            where: {
                id: postId
            },
            include: {
                author: true
            }
        })

        await prismaClient.user.update({
            where: {
                id: deletedPost.authorId
            },
            data: {
                postsCount: { decrement: 1 }
            }
        })
        return deletedPost
    },
    getPostBySlug: async function (postSlug: string) {
        return await prismaClient.post.findUnique({
            where: { slug: postSlug },
            include: {
                author: {
                    select: excludeUserFields(['hashedPassword', 'refreshToken'])
                },
                tags: true,
                comments: {
                    select: {
                        id: true,
                        content: true,
                        authorId: true,
                        author: true,
                        createdAt: true,
                        totalLikes: true
                    }
                },
                _count: true
            }
        })
    }
}

function excludeUserFields(keys: string[]) {
    let userFields = {
        id: true,
        avatarUrl: true,
        username: true,
        fullName: true,
        email: true,
        hashedPassword: true,
        insertedAt: true,
        updatedAt: true,
        postsCount: true,
        refreshToken: true,
        profile: true,
        posts: true
    }

    return Object.entries(userFields).reduce((acc: any, cv) => {
        if (!keys.includes(cv[0])) {
            return { ...acc, ...{ [cv[0]]: true } }
        } else {
            return acc
        }
    }, {})
}

/*
function filterUserFields<User, Key extends keyof User>(user: User, keys: Key[]): Omit<User, Key> {
    for (let key of keys) {
        delete user[key]
    }
    return user
}
*/

export default PostTask