/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `birthDate` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `postalCode` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `main_image` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "createdAt",
DROP COLUMN "updatedAt",
ADD COLUMN     "brand" TEXT,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "discount_percentage" INTEGER,
ADD COLUMN     "in_stock" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "main_image" TEXT NOT NULL,
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "review_count" INTEGER DEFAULT 0,
ADD COLUMN     "specifications" JSONB,
ADD COLUMN     "stock_quantity" INTEGER,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "birthDate",
DROP COLUMN "createdAt",
DROP COLUMN "postalCode",
DROP COLUMN "updatedAt",
ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "postal_code" TEXT,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;
