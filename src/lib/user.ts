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
        // return await prismaClient.user.findUnique({
        //     where: { username: username },
        //     select: { followings: { include: { follower: true } } }
        // })
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
        // return await prismaClient.user.findUnique({
        //     where: { username: username },
        //     select: { followers: { include: { followed: true } } }
        // })
    },
    createUserFollower: async function (followerId: string, userId: string) {

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

        return await prismaClient.userFollower.upsert({
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
    },
    unfollowUser: async function (followerId: string, userId: string) {

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

        return await prismaClient.userFollower.delete({
            where: {
                followedId_followerId: {
                    followedId: userId,
                    followerId: followerId
                }
            }
        })
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

        const { bio, location, website, siteTheme, ...data } = userData

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
                        themeMode: siteTheme
                    }
                }
            },
            include: {
                profile: true
            }
        })
    }
}

export default UserTask