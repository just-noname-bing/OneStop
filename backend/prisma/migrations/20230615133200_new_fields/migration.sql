/*
  Warnings:

  - Added the required column `stop_id` to the `Post` table without a default value. This is not possible if the table is not empty.
  - Added the required column `trip_id` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "stop_id" TEXT NOT NULL,
ADD COLUMN     "trip_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_stop_id_fkey" FOREIGN KEY ("stop_id") REFERENCES "Stops"("stop_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trips"("trip_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_stop_id_trip_id_fkey" FOREIGN KEY ("stop_id", "trip_id") REFERENCES "Stop_times"("stop_id", "trip_id") ON DELETE RESTRICT ON UPDATE CASCADE;
