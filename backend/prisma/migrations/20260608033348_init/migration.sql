-- AlterTable
ALTER TABLE `song` ADD COLUMN `songHistoryId` INTEGER NULL;

-- CreateTable
CREATE TABLE `SongHistory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Song` ADD CONSTRAINT `Song_songHistoryId_fkey` FOREIGN KEY (`songHistoryId`) REFERENCES `SongHistory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SongHistory` ADD CONSTRAINT `SongHistory_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
