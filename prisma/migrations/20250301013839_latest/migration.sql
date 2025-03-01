/*
 Warnings:
 
 - You are about to drop the column `price` on the `OrderItem` table. All the data in the column will be lost.
 - A unique constraint covering the columns `[sku]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
 - Added the required column `totalPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
 - Added the required column `unitPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
 
 */
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "order_userId_user_id_fk";
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "orderItems_orderId_order_id_fk";
-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "orderItems_productId_product_id_fk";
-- AlterTable
-- Rename constraint
ALTER TABLE "OrderItem"
  RENAME CONSTRAINT "orderItems_orderId_productId_pk" TO "OrderItem_pkey";
-- Modify columns separately
ALTER TABLE "OrderItem" DROP COLUMN "price";
ALTER TABLE "OrderItem"
ADD COLUMN "totalPrice" DECIMAL(12, 2) NOT NULL;
ALTER TABLE "OrderItem"
ADD COLUMN "unitPrice" DECIMAL(12, 2) NOT NULL;
-- AlterTable
ALTER TABLE "Product"
ADD COLUMN "isDiscontinued" BOOLEAN NOT NULL DEFAULT false,
  ALTER COLUMN "stock"
SET DEFAULT 0;
-- CreateIndex
CREATE INDEX "Order_userId_idx" ON "Order"("userId");
-- CreateIndex
CREATE INDEX "Order_createdAt_idx" ON "Order"("createdAt");
-- CreateIndex
CREATE INDEX "Order_isDelivered_idx" ON "Order"("isDelivered");
-- CreateIndex
CREATE INDEX "Order_isPaid_idx" ON "Order"("isPaid");
-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
-- CreateIndex
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");
-- CreateIndex
CREATE UNIQUE INDEX "Product_sku_key" ON "Product"("sku");
-- CreateIndex
CREATE INDEX "Product_category_idx" ON "Product"("category");
-- CreateIndex
CREATE INDEX "Product_brand_idx" ON "Product"("brand");
-- CreateIndex
CREATE INDEX "Product_createdAt_idx" ON "Product"("createdAt");
-- AddForeignKey
ALTER TABLE "Order"
ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "OrderItem"
ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "OrderItem"
ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;