-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "attributeName" TEXT NOT NULL,
    "attributeValue" TEXT,
    "productId" TEXT NOT NULL,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
