import prismaClient from '@/lib/db/prismaClient'

function paginationQuery(take: number, skip: number) {
    return {
        where: {},
        include: {
            comments: true,
            tags: true,
            bookmarks: true,
            likes: true,
            author: {
                select: excludeUserFields(['hashedPassword', 'refreshToken', 'posts'])
            },
        },
        take: take,
        skip: skip
    }
}

let PostTask = {
    getNumOfRecords: async function (searchQuery = {}) {

        // let query = {
        //     _count: { id: true },
        //     where: {}
        // }

        // if (Object.keys(searchQuery).length) {
        //     query = {
        //         ...query,
        //         where: searchQuery
        //     }
        // }

        return await prismaClient.post.aggregate({
            _count: { id: true },
            where: searchQuery
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
    createBookmark: async function (authorId: string, postId: string) {

        const bookmark = prismaClient.postBookmark.create({
            data: {
                author: { connect: { id: authorId } },
                post: { connect: { id: postId } }
            },
            include: {
                author: { select: excludeUserFields(['hashedPassword', 'refreshToken']) },
                post: true
            }
        })

        await prismaClient.post.update({
            where: { id: postId },
            data: { totalBookmarks: { increment: 1 } }
        })

        return bookmark
    },
    deleteBookmark: async function (authorId: string, postId: string) {
        const deletedBookmark = prismaClient.postBookmark.delete({
            where: {
                authorId_postId: {
                    authorId: authorId,
                    postId: postId
                }
            },
            include: {
                author: { select: excludeUserFields(['hashedPassword', 'refreshToken']) },
                post: true
            }
        })

        await prismaClient.post.update({
            where: { id: postId },
            data: { totalBookmarks: { decrement: 1 } }
        })

        return deletedBookmark
    },
    createLike: async function (authorId: string, resourceId: string, resourceType: 'post' | 'comment') {

        let queryData = resourceType === 'post' ?
            {
                data: { post: { connect: { id: resourceId } } },
                include: { comment: true }
            } :
            {
                data: { comment: { connect: { id: resourceId } } },
                include: { comment: true }
            }

        const like = await prismaClient.like.create({
            data: {
                author: { connect: { id: authorId } },
                resourceId: resourceId,
                ...queryData.data
            },
            include: {
                author: { select: excludeUserFields(['hashedPassword', 'refreshToken']) },
                ...queryData.include
            }
        })

        if (resourceType === 'post') {
            await prismaClient.post.update({
                where: { id: resourceId },
                data: { totalLikes: { increment: 1 } }
            })
        } else {
            await prismaClient.comment.update({
                where: { id: resourceId },
                data: { totalLikes: { increment: 1 } }
            })
        }

        return like
    },
    deleteLike: async function (authorId: string, resourceId: string, resourceType: 'post' | 'comment') {

        let queryWhere = {}

        if (resourceType === 'post') {
            queryWhere = {
                where: {
                    authorId: authorId,
                    postId: resourceId
                }
            }
        } else {
            queryWhere = {
                where: {
                    authorId: authorId,
                    commentId: resourceId
                }
            }
        }

        const deleted = await prismaClient.like.deleteMany({ ...queryWhere })

        if (deleted.count > 0) {
            if (resourceType === 'post') {
                await prismaClient.post.update({
                    where: { id: resourceId },
                    data: { totalLikes: { decrement: 1 } }
                })
            } else {
                await prismaClient.comment.update({
                    where: { id: resourceId },
                    data: { totalLikes: { decrement: 1 } }
                })
            }
        }
        return deleted
    },
    getPostLikes: async function (postId: string) {
        return await prismaClient.like.findMany({
            where: { postId: postId }
        })
    },
    getCommentLikes: async function (commentId: string) {
        return await prismaClient.like.findMany({
            where: { commentId: commentId }
        })
    },
    isPostLiked: async function (userId: string, postId: string) {
        return await prismaClient.like.findFirst({
            where: {
                authorId: userId,
                postId: postId
            }
        })
    },
    isCommentLiked: async function (userId: string, commentId: string) {
        return await prismaClient.like.findFirst({
            where: {
                authorId: userId,
                commentId: commentId
            }
        })
    },
    getPaginatedPosts: async function (take: number, skip: number, searchQuery = {}) {

        let query = paginationQuery(take, skip)

        if (Object.keys(searchQuery).length) {
            query = {
                ...query,
                where: searchQuery
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
    deleteComment: async function (commentId: string) {

        const deleted = await prismaClient.comment.delete({
            where: {
                id: commentId
            }
        })

        if (deleted) {
            await prismaClient.post.update({
                where: {
                    id: deleted.postId
                },
                data: {
                    totalComments: { decrement: 1 }
                }
            })
        }

        return deleted
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
    getAllPostComments: async function (postId: string, take?: number, skip?: number) {
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
                replies: true,
                likes: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            // take: take,
            // skip: skip
        })
    },
    getNumOfPostComments: async function (postId: string) {
        return await prismaClient.comment.aggregate({
            where: {
                postId: postId
            },
            _count: { id: true }
        })
    },
    // getPostComments: async function (take: number, skip: number, postId: string) {
    //     let query = {
    //         where: {
    //             postId: postId
    //         },
    //         include: {
    //             comments: true,
    //             tags: true,
    //             author: {
    //                 select: excludeUserFields(['hashedPassword', 'refreshToken', 'posts'])
    //             },
    //         },
    //         take: take,
    //         skip: skip
    //     }
    //     return await prismaClient.comment.findMany(query)
    // },
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

        const maybeCreateNewTags = await this.maybeCreateNewTags(postTags)

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

        const maybeCreateNewTags = await this.maybeCreateNewTags(postTags)

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
                bookmarks: true,
                likes: true,
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