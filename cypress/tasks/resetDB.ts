import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export default async function resetDB() {
    return await prisma.$transaction([
        prisma.user.deleteMany(),
        prisma.post.deleteMany(),
        prisma.tag.deleteMany()
    ])
}
