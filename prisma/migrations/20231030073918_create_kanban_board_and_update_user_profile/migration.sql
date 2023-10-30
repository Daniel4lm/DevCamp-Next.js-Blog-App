/*
  Warnings:

  - Added the required column `columnId` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ArticleColumnType" AS ENUM ('TO_DO', 'IN_PROGRESS', 'IN_REVIEW', 'COMPLETED', 'PUBLISHED');

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "columnId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "profiles" ADD COLUMN     "kanbanColumnsReviewed" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "profileVisited" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ArticleBoardColumn" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "ArticleColumnType" NOT NULL DEFAULT 'TO_DO',
    "color" TEXT,

    CONSTRAINT "ArticleBoardColumn_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_columnId_fkey" FOREIGN KEY ("columnId") REFERENCES "ArticleBoardColumn"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
