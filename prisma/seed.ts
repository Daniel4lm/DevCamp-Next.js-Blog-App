import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedUsers() {
    // Perform database queries here

    const daniel = await prisma.user.upsert({
        where: { email: 'daniel@gmail.com' },
        update: {},
        create: {
            email: 'daniel@gmail.com',
            fullName: 'Daniel Molnar',
            hashedPassword: '#gf-.tz8708v$9%7/*/ziu?)*=?ILLUgnfhg',
            username: 'daniel4mx',
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

    const dijana = await prisma.user.upsert({
        where: { email: 'dijana@gmail.com' },
        update: {},
        create: {
            email: 'dijana@gmail.com',
            fullName: 'Diana Molnar',
            hashedPassword: '#gf-.tz87089%7%4/*/ziu?)*=?ILLUgnfhg',
            username: 'dijana_tz',
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

    Promise.all([daniel, dijana])
        .then(values => {
            console.log('Results: ', values)
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

// main()
//     .catch(error => {
//         console.error(error)
//         process.exit(1)
//     })
//     .finally(async () => {
//         await prisma.$disconnect()
//     })