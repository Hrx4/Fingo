/*
  Warnings:

  - Made the column `privateKey` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `walletAddress` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "privateKey" SET NOT NULL,
ALTER COLUMN "walletAddress" SET NOT NULL;
