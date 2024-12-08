/*
  Warnings:

  - You are about to drop the column `displayType` on the `VariantOption` table. All the data in the column will be lost.
  - You are about to drop the column `displayValue` on the `VariantOption` table. All the data in the column will be lost.
  - You are about to drop the column `thumbnailUrl` on the `VariantOption` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[swatchId]` on the table `VariantOption` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `VariantOption` table without a default value. This is not possible if the table is not empty.
  - Added the required column `swatchId` to the `VariantOption` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "SwatchType" AS ENUM ('COLOR', 'IMAGE', 'TEXT');

-- CreateEnum
CREATE TYPE "SwatchShape" AS ENUM ('CIRCLE', 'SQUARE');

-- AlterTable
ALTER TABLE "VariantOption" DROP COLUMN "displayType",
DROP COLUMN "displayValue",
DROP COLUMN "thumbnailUrl",
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "swatchId" TEXT NOT NULL;

-- DropEnum
DROP TYPE "DisplayType";

-- CreateTable
CREATE TABLE "Swatch" (
    "id" TEXT NOT NULL,
    "swatchType" "SwatchType" NOT NULL DEFAULT 'TEXT',
    "swatchShape" "SwatchShape" NOT NULL DEFAULT 'SQUARE',
    "swatchColor" TEXT,
    "swatchThumbnailUrl" TEXT,
    "swatchText" TEXT,

    CONSTRAINT "Swatch_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VariantOption_swatchId_key" ON "VariantOption"("swatchId");

-- AddForeignKey
ALTER TABLE "VariantOption" ADD CONSTRAINT "VariantOption_swatchId_fkey" FOREIGN KEY ("swatchId") REFERENCES "Swatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
