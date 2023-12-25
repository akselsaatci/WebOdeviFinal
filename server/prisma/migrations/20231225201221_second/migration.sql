/*
  Warnings:

  - You are about to drop the column `likeCounts` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `published` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the `ComplaintImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ComplaintImage" DROP CONSTRAINT "ComplaintImage_complaintId_fkey";

-- AlterTable
ALTER TABLE "Complaint" DROP COLUMN "likeCounts",
DROP COLUMN "published";

-- DropTable
DROP TABLE "ComplaintImage";
