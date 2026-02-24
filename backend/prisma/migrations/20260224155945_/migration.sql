/*
  Warnings:

  - You are about to drop the column `download_url` on the `music_tracks` table. All the data in the column will be lost.
  - You are about to drop the column `stream_url` on the `music_tracks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "music_tracks" DROP COLUMN "download_url",
DROP COLUMN "stream_url",
ADD COLUMN     "file_path" TEXT;
