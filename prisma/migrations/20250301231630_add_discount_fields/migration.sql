-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discountRate" INTEGER,
ADD COLUMN     "isDiscounted" BOOLEAN NOT NULL DEFAULT false;
