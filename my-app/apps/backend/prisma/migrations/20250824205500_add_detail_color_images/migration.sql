-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "color_images" JSONB,
ADD COLUMN     "detail_images" TEXT[];
