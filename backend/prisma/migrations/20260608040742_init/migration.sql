/*
  Warnings:

  - You are about to drop the column `songHistoryId` on the `song` table. All the data in the column will be lost.
  - Added the required column `songId` to the `SongHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `song` DROP FOREIGN KEY `Song_songHistoryId_fkey`;

-- DropIndex
DROP INDEX `Song_songHistoryId_fkey` ON `song`;

-- AlterTable
ALTER TABLE `song` DROP COLUMN `songHistoryId`;

-- AlterTable
ALTER TABLE `songhistory` ADD COLUMN `songId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `SongHistory` ADD CONSTRAINT `SongHistory_songId_fkey` FOREIGN KEY (`songId`) REFERENCES `Song`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
