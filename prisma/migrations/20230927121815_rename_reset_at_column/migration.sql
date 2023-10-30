/*
  Warnings:

  - You are about to drop the column `resetedAt` on the `ResetPasswordToken` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ResetPasswordToken" RENAME COLUMN "resetedAt" TO "resetAt";
