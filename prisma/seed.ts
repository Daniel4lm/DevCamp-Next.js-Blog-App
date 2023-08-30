import { PrismaClient } from '@prisma/client'
import { genSaltSync, hashSync } from 'bcryptjs'
const prisma = new PrismaClient()

export function encryptPassword(receivedPassword: string) {
    let saltRounds = 10
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
                }, {
                    title: 'Validate related schema attributes with Zod',
                    slug: 'validate-related-schema-attributes-with-zod',
                    tags: {
                        create: [
                            {
                                name: "zod"
                            },
                            {
                                name: "javascript"
                            }
                        ]
                    },
                    body: "<p>Zod is a TypeScript-first schema declaration and validation library.</p><p> I'm using the term 'schema' to broadly refer to any data type, from a simple string to a complex nested object.</p>",
                    published: true
                }, {
                    title: 'Marketing for Developers: The Unconventional Guide ',
                    slug: 'marketing-for-developers-the-unconventional-guide ',
                    tags: {
                        create: [
                            {
                                name: "tutorial"
                            },
                            {
                                name: "coding"
                            }
                        ]
                    },
                    body: `<p>You've built an amazing new product. The code is elegant, the interface intuitive. You launch it with pride!</p>
                    <br>
                    <p>But then...tumbleweeds. Crickets. Where are all the users?</p>
                    <br>
                    <p>As developers, we excel at building products but often neglect marketing them. Let's change that!</p>`,
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
