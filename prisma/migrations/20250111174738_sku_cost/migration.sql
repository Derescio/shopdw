/*
 Warnings:
 
 - Added the required column `sku` to the `Product` table without a default value. This is not possible if the table is not empty.
 
 */
-- AlterTable
ALTER TABLE "Product"
ADD COLUMN "costPrice" DECIMAL(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN "sku" TEXT NOT NULL DEFAULT '';