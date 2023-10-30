import { ArticleColumnType } from '../../models/ArticleBoard'
import { PrismaClient, User } from '@prisma/client'
import { genSaltSync, hashSync } from 'bcryptjs'
const prisma = new PrismaClient()

export function encryptPassword(receivedPassword: string) {
    let saltRounds = 10
    let salt = genSaltSync(saltRounds)
    return hashSync(receivedPassword, salt)
}

export async function seedDB() {
    // Perform database queries here

    const boardColumns: {
        description: string;
        title: string;
        type: ArticleColumnType;
    }[] = [
            {
                description: "Content Ideas list is the collection of all your content creation ideas, research results, content gathering etc. In this state, the status ofthe article is Opened. Simply drag and drop the story to To Do list when you decide to schedule your production",
                title: 'Todo',
                type: ArticleColumnType.TO_DO
            },
            {
                description: "Articles in this state can get more detailed information abour production planning, such as Start Date, End Date, listed story tasks etc.When you are ready to start producing the article simply drag and drop to In Progress list",
                title: 'In progress',
                type: ArticleColumnType.IN_PROGRESS
            },
            {
                description: "This list holds all the articles that you have already started to work on. If you would like to invite another person to do the review before publishing, share your article and let them leave their comments on your article.",
                title: 'In review',
                type: ArticleColumnType.IN_REVIEW
            },
            {
                description: "When article is sent for a review, user is able to decide whether this article will automatically change the status or not(checkbox): if checked, article will automatically move to this list, otherwise user can manually drag and drop article to this list",
                title: 'Completed',
                type: ArticleColumnType.COMPLETED
            },
            {
                description: "User will drag and drop succefully published articles to this column; after this you can archive your article and it will be available for other users",
                title: 'Published',
                type: ArticleColumnType.PUBLISHED
            }
        ]

    let col = await prisma.articleBoardColumn.createMany({
        data: boardColumns
    })

    let toDoColumn = await prisma.articleBoardColumn.findFirst({
        where: { type: 'TO_DO' }
    })

    let inProgressColumn = await prisma.articleBoardColumn.findFirst({
        where: { type: 'IN_PROGRESS' }
    })

    let daniel: User | undefined
    let diana: User | undefined

    if (toDoColumn && inProgressColumn) {
        daniel = await prisma.user.upsert({
            where: { email: 'daniel@gmail.com' },
            update: {},
            create: {
                email: 'daniel@gmail.com',
                fullName: 'Daniel Molnar',
                hashedPassword: encryptPassword("4444333"),
                username: 'daniel4mx',
                postsCount: 3,
                profile: {
                    create: {
                        bio: "Hello, I'm Daniel from Tuzla"
                    }
                },
                posts: {
                    create: [{
                        columnId: toDoColumn?.id || '',
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
                        columnId: toDoColumn?.id || '',
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
                        columnId: inProgressColumn?.id || '',
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

        diana = await prisma.user.upsert({
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
                            columnId: toDoColumn?.id || '',
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
    }

    let results: (User | undefined)[] = []

    Promise.all([daniel, diana])
        .then(values => {
            results = values
        }).
        catch(error => {
            console.error(error)
            process.exit(1)
        })
        .finally(async () => {
            await prisma.$disconnect()
        })

    return results
}