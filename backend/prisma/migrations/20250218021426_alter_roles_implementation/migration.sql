/*
  Warnings:

  - You are about to drop the column `isActive` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isStaff` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `isActive`,
    DROP COLUMN `isAdmin`,
    DROP COLUMN `isStaff`;

-- CreateTable
CREATE TABLE `Role` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL DEFAULT 'User',
    `userId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Role` ADD CONSTRAINT `Role_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
