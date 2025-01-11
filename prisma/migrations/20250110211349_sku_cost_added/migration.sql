/*
 Warnings:
 
 - A unique constraint covering the columns `[sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
 - Added the required column `sku` to the `Product` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "Product"
ADD COLUMN "costPrice" DECIMAL(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN "sku" TEXT;
-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");