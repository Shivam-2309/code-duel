/*
  Warnings:

  - You are about to drop the column `verified` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "verified",
ADD COLUMN     "cfTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN     "cfVerificationToken" TEXT,
ADD COLUMN     "cfVerified" BOOLEAN NOT NULL DEFAULT false;
