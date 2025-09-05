/*
  Warnings:

  - A unique constraint covering the columns `[newId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "newId" TEXT,
ALTER COLUMN "detail_images" SET DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Product_newId_key" ON "public"."Product"("newId");
