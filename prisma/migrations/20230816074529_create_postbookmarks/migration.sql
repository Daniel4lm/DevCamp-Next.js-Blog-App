-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "totalBookmarks" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "posts_bookmarks" (
    "authorId" TEXT NOT NULL,
    "postId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "posts_bookmarks_authorId_postId_key" ON "posts_bookmarks"("authorId", "postId");

-- AddForeignKey
ALTER TABLE "posts_bookmarks" ADD CONSTRAINT "posts_bookmarks_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts_bookmarks" ADD CONSTRAINT "posts_bookmarks_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
