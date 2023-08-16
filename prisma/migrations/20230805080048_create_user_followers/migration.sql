-- AlterTable
ALTER TABLE "users" ADD COLUMN     "followersCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "followingCount" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "user_followers" (
    "followedId" TEXT NOT NULL,
    "followerId" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_followers_followedId_followerId_key" ON "user_followers"("followedId", "followerId");

-- AddForeignKey
ALTER TABLE "user_followers" ADD CONSTRAINT "user_followers_followedId_fkey" FOREIGN KEY ("followedId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_followers" ADD CONSTRAINT "user_followers_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
