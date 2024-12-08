/*
  Warnings:

  - You are about to drop the column `combination` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Variant` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VariantOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_productId_fkey";

-- DropForeignKey
ALTER TABLE "VariantOption" DROP CONSTRAINT "VariantOption_swatchId_fkey";

-- DropForeignKey
ALTER TABLE "VariantOption" DROP CONSTRAINT "VariantOption_variantId_fkey";

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "combination",
ADD COLUMN     "variantCombination" JSON;

-- DropTable
DROP TABLE "Variant";

-- DropTable
DROP TABLE "VariantOption";

-- CreateTable
CREATE TABLE "Variantion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Variantion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariantionOption" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "optionSlug" TEXT NOT NULL,
    "variantionId" TEXT NOT NULL,
    "swatchId" TEXT NOT NULL,

    CONSTRAINT "VariantionOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "variant_product_idx" ON "Variantion"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "VariantionOption_swatchId_key" ON "VariantionOption"("swatchId");

-- CreateIndex
CREATE INDEX "option_variant_idx" ON "VariantionOption"("variantionId");

-- AddForeignKey
ALTER TABLE "Variantion" ADD CONSTRAINT "Variantion_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantionOption" ADD CONSTRAINT "VariantionOption_swatchId_fkey" FOREIGN KEY ("swatchId") REFERENCES "Swatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariantionOption" ADD CONSTRAINT "VariantionOption_variantionId_fkey" FOREIGN KEY ("variantionId") REFERENCES "Variantion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
