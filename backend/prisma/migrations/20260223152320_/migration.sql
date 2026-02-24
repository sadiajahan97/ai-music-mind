-- CreateTable
CREATE TABLE "music_tracks" (
    "id" TEXT NOT NULL,
    "download_url" TEXT,
    "duration" INTEGER,
    "image_url" TEXT,
    "model" TEXT,
    "mood" TEXT,
    "stream_url" TEXT,
    "style" TEXT,
    "tags" TEXT,
    "title" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "music_tracks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "music_tracks" ADD CONSTRAINT "music_tracks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
