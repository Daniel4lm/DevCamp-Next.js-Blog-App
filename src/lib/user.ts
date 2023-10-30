import prismaClient from '@/lib/db/prismaClient'
import { randomUUID } from 'crypto'

let UserTask = {
    getUser: async function (searchQuery = {}) {

        try {
            return await prismaClient.user.findFirst({
                where: searchQuery,
                select: {
                    id: true,
                    avatarUrl: true,
                    email: true,
                    username: true,
                    fullName: true,
                    postsCount: true,
                    role: true,
                    profile: true,
                    posts: {
                        include: {
                            author: true,
                            tags: true
                        }
                    },
                    followersCount: true,
                    followingCount: true
                }
            })
        } catch (err) {
            if (err instanceof Error) console.error(`Error: ${err.message}`)
            return undefined
        }
    },
    getActivePasswordResetStatus: async function (userId: string) {
        return await prismaClient.resetPasswordToken.findFirst({
            where: {
                userId: userId,
                createdAt: {
                    gt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
                },
                resetAt: null
            }
        })
    },
    createResetPasswordToken: async function (userId: string) {
        return await prismaClient.resetPasswordToken.create({
            data: {
                userId: userId,
                token: `${randomUUID()}-${randomUUID()}`.replace(/-/g, '')
            }
        })
    },
    resetUserPassword: async function (password: string, token: string) {

        const updateDate = new Date()

        const passwordResetToken = await prismaClient.resetPasswordToken.findUnique({
            where: {
                token: token,
                createdAt: {
                    gt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
                },
                resetAt: null
            }
        })

        const invalidatedToken = prismaClient.resetPasswordToken.update({
            where: {
                id: passwordResetToken?.id
            },
            data: {
                resetAt: updateDate,
            }
        })

        const updatedUser = prismaClient.user.update({
            where: {
                id: passwordResetToken?.userId
            },
            data: {
                passwordUpdatedAt: updateDate,
                hashedPassword: password
            }
        })

        // if (invalidatedToken.resetAt) {
        //     return await prismaClient.user.update({
        //         where: {
        //             id: invalidatedToken.userId
        //         },
        //         data: {
        //             passwordUpdatedAt: updateDate,
        //             hashedPassword: password
        //         }
        //     })
        // }


        return await prismaClient.$transaction([
            invalidatedToken, updatedUser
        ])
    },
    getUsers: async function (searchQuery = {}) {

        return await prismaClient.user.findMany({
            where: searchQuery,

        })
    },
    getUserFollowing: async function (followerId: string, followedId: string) {
        return await prismaClient.userFollower.findUnique({
            where: {
                followedId_followerId: {
                    followerId: followerId,
                    followedId: followedId
                }
            },
            include: {
                followed: true,
                follower: true
            }
        })
    },
    getFollowers: async function (userID: string) {
        return await prismaClient.userFollower.findMany({
            where: { followedId: userID },
            select: {
                follower: {
                    include: {
                        followers: true,
                        followings: true
                    }
                }
            }
        })
    },
    getFollowing: async function (userID: string) {
        return await prismaClient.userFollower.findMany({
            where: { followerId: userID },
            select: {
                followed: {
                    include: {
                        followers: true,
                        followings: true
                    }
                }
            }
        })
    },
    isAlreadyFollower: async function (followerId: string, userId: string) {
        return await prismaClient.userFollower.findUnique({
            where: {
                followedId_followerId: {
                    followedId: userId,
                    followerId: followerId
                }
            },
        })
    },
    createUserFollower: async function (followerId: string, userId: string) {

        const userFollower = await prismaClient.userFollower.upsert({
            where: {
                followedId_followerId: {
                    followedId: userId,
                    followerId: followerId
                }
            },
            update: {},
            create: {
                followedId: userId,
                followerId: followerId
            }
        })

        const updateFollowingCount = await prismaClient.user.updateMany({
            where: {
                id: followerId
            },
            data: {
                followingCount: { increment: 1 }
            }
        })

        const updateFollowersCount = await prismaClient.user.updateMany({
            where: {
                id: userId
            },
            data: {
                followersCount: { increment: 1 }
            }
        })

        return userFollower
    },
    unfollowUser: async function (followerId: string, userId: string) {

        let unfollowUser

        try {
            unfollowUser = await prismaClient.userFollower.delete({
                where: {
                    followedId_followerId: {
                        followedId: userId,
                        followerId: followerId
                    }
                }
            })

        } catch (error) {
            return error
        }

        if (unfollowUser) {
            const updateFollowingCount = await prismaClient.user.updateMany({
                where: {
                    id: followerId
                },
                data: {
                    followingCount: { decrement: 1 }
                }
            })

            const updateFollowersCount = await prismaClient.user.updateMany({
                where: {
                    id: userId
                },
                data: {
                    followersCount: { decrement: 1 }
                }
            })
        }
        return unfollowUser
    },
    createNewUser: async function (data: {
        username: string
        fullName: string
        email: string
        hashedPassword: string
    }) {
        const createUser = await prismaClient.user.create({
            data: {
                ...data,
                profile: {
                    create: {
                        bio: `Hello, I'm ${data.fullName}`
                    }
                },
            },

        })
        return createUser
    },
    updateUser: async function (userData: any) {

        const { bio, fontName, location, siteTheme, website, ...data } = userData

        return await prismaClient.user.update({
            where: {
                id: data.id
            },
            data: {
                ...data,
                profile: {
                    update: {
                        bio: bio,
                        location: location,
                        website: website,
                        themeMode: siteTheme,
                        fontName: fontName
                    }
                }
            },
            include: {
                profile: true
            }
        })
    },
    updateProfile: async function (userId: string, data: {}) {

        return await prismaClient.profile.update({
            where: {
                userId: userId
            },
            data: {
                ...data
            },
            include: {
                user: true
            }
        })
    }
}

export default UserTask