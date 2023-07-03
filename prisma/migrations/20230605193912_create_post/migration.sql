-- CreateTable
CREATE TABLE `Post` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `body` VARCHAR(500) NOT NULL,
    `photo_url` VARCHAR(191) NULL,
    `published` BOOLEAN NOT NULL DEFAULT false,
    `totalLikes` INTEGER NOT NULL DEFAULT 0,
    `totalComments` INTEGER NOT NULL DEFAULT 0,
    `authorId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
