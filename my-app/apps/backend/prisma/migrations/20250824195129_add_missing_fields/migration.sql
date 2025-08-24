-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "colors" TEXT[],
ADD COLUMN     "featured" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "original_price" DOUBLE PRECISION,
ADD COLUMN     "sizes" TEXT[],
ADD COLUMN     "subcategory" TEXT;
