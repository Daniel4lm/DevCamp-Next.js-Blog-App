import { PrismaClient } from '@prisma/client'
import { hashSync, genSaltSync } from "bcryptjs"

const prisma = new PrismaClient()

function encryptPassword(receivedPassword: string) {
    let saltRounds = 10
    // generate the password hash
    let salt = genSaltSync(saltRounds)
    return hashSync(receivedPassword, salt)
}

async function seedUsers() {
    // Perform database queries here

    const daniel = await prisma.user.upsert({
        where: { email: 'daniel@gmail.com' },
        update: {},
        create: {
            email: 'daniel@gmail.com',
            fullName: 'Daniel Molnar',
            hashedPassword: encryptPassword("4444333"),
            username: 'daniel4mx',
            postsCount: 1,
            profile: {
                create: {
                    bio: "Hello, I'm Daniel from Tuzla"
                }
            },
            posts: {
                create: [{
                    title: 'Next.js 13 release',
                    slug: 'next-js-13-release',
                    tags: {
                        create: [
                            {
                                name: "next.js"
                            },
                            {
                                name: "front-end"
                            }
                        ]
                    },
                    body: "Next. js v13 was released by Vercel at the Next. js conference in October 2022, bringing many new features and improvements.",
                    published: true
                }]
            }
        }
    })

    const diana = await prisma.user.upsert({
        where: { email: 'diana@gmail.com' },
        update: {},
        create: {
            email: 'diana@gmail.com',
            fullName: 'Diana Molnar',
            hashedPassword: encryptPassword("lana_picak"),
            username: 'diana_tz',
            postsCount: 1,
            profile: {
                create: {
                    bio: "Hello, I'm an Artist"
                }
            },
            posts: {
                create: [
                    {
                        title: 'React 18 release',
                        slug: 'react-18-release',
                        tags: {
                            create: [
                                {
                                    name: "react"
                                },
                                {
                                    name: "dev"
                                }
                            ]
                        },
                        body: "React 18 was released in March 2022. This release focuses on performance improvements and updating the rendering engine."
                    },
                ]
            }
        }
    })

    Promise.all([daniel, diana])
        .then(values => {
            console.info('Results: ', values)
        }).
        catch(error => {
            console.error(error)
            process.exit(1)
        })
        .finally(async () => {
            await prisma.$disconnect()
        })
}

seedUsers()
