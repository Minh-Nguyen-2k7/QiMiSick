/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Mood` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Mood_name_key` ON `Mood`(`name`);
