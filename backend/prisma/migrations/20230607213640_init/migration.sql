/*
  Warnings:

  - You are about to drop the column `calendarService_id` on the `Trips` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Trips" DROP CONSTRAINT "Trips_calendarService_id_fkey";

-- AlterTable
ALTER TABLE "Trips" DROP COLUMN "calendarService_id";

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Calendar"("service_id") ON DELETE RESTRICT ON UPDATE CASCADE;
