-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "fit" TEXT,
ADD COLUMN     "measurements" JSONB,
ADD COLUMN     "size_guide" JSONB;

-- CreateTable
CREATE TABLE "public"."SizeGuide" (
    "id" SERIAL NOT NULL,
    "category" TEXT NOT NULL,
    "subcategory" TEXT,
    "measures" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SizeGuide_pkey" PRIMARY KEY ("id")
);
