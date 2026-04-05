-- AlterTable
ALTER TABLE "music_tracks" ADD COLUMN     "is_explicit" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_published" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "task_id" TEXT;
