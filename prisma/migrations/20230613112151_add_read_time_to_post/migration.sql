-- AlterTable
ALTER TABLE `post` ADD COLUMN `readTime` INTEGER NOT NULL DEFAULT 0,
    MODIFY `body` TEXT NOT NULL;
