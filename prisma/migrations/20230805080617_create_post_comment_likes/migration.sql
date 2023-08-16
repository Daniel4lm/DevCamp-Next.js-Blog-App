-- CreateTable
CREATE TABLE "likes" (
    "authorId" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "postId" TEXT,
    "commentId" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "likes_resourceId_key" ON "likes"("resourceId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_authorId_resourceId_key" ON "likes"("authorId", "resourceId");

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
