/*
  Warnings:

  - You are about to drop the `role` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `role` DROP FOREIGN KEY `Role_userId_fkey`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `roles` VARCHAR(191) NOT NULL DEFAULT 'User';

-- DropTable
DROP TABLE `role`;
