/*
  Warnings:

  - You are about to drop the `Variantion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `VariantionOption` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Variantion" DROP CONSTRAINT "Variantion_productId_fkey";

-- DropForeignKey
ALTER TABLE "VariantionOption" DROP CONSTRAINT "VariantionOption_swatchId_fkey";

-- DropForeignKey
ALTER TABLE "VariantionOption" DROP CONSTRAINT "VariantionOption_variantionId_fkey";

-- DropTable
DROP TABLE "Variantion";

-- DropTable
DROP TABLE "VariantionOption";

-- CreateTable
CREATE TABLE "Variation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Variation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariationOption" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "optionSlug" TEXT NOT NULL,
    "variationId" TEXT NOT NULL,
    "swatchId" TEXT NOT NULL,

    CONSTRAINT "VariationOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "variation_product_idx" ON "Variation"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "VariationOption_swatchId_key" ON "VariationOption"("swatchId");

-- CreateIndex
CREATE INDEX "option_variantion_idx" ON "VariationOption"("variationId");

-- AddForeignKey
ALTER TABLE "Variation" ADD CONSTRAINT "Variation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariationOption" ADD CONSTRAINT "VariationOption_swatchId_fkey" FOREIGN KEY ("swatchId") REFERENCES "Swatch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VariationOption" ADD CONSTRAINT "VariationOption_variationId_fkey" FOREIGN KEY ("variationId") REFERENCES "Variation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
