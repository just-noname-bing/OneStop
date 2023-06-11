/*
  Warnings:

  - You are about to drop the column `shapesShape_id` on the `Trips` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Trips" DROP CONSTRAINT "Trips_shapesShape_id_shapesShape_dist_traveled_fkey";

-- AlterTable
ALTER TABLE "Trips" DROP COLUMN "shapesShape_id";

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_shape_id_shapesShape_dist_traveled_fkey" FOREIGN KEY ("shape_id", "shapesShape_dist_traveled") REFERENCES "Shapes"("shape_id", "shape_dist_traveled") ON DELETE RESTRICT ON UPDATE CASCADE;
