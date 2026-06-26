/*
  Warnings:

  - You are about to drop the column `isFavourite` on the `song` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `song` DROP COLUMN `isFavourite`,
    ADD COLUMN `isFavorite` BOOLEAN NOT NULL DEFAULT false;
