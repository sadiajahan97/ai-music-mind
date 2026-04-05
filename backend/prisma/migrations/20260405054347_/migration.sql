/*
  Warnings:

  - You are about to drop the column `is_ready` on the `music_tracks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "music_tracks" DROP COLUMN "is_ready",
ADD COLUMN     "status" TEXT;
