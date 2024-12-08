/*
  Warnings:

  - You are about to drop the column `slug` on the `VariantOption` table. All the data in the column will be lost.
  - Added the required column `optionSlug` to the `VariantOption` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VariantOption" DROP COLUMN "slug",
ADD COLUMN     "optionSlug" TEXT NOT NULL;
