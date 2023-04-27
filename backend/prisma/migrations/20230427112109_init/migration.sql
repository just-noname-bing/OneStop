/*
  Warnings:

  - You are about to drop the `Route` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Trips" DROP CONSTRAINT "Trips_route_id_fkey";

-- DropTable
DROP TABLE "Route";

-- CreateTable
CREATE TABLE "Routes" (
    "route_id" TEXT NOT NULL,
    "route_short_name" TEXT NOT NULL,
    "route_long_name" TEXT NOT NULL,
    "route_desc" TEXT NOT NULL,
    "route_type" TEXT NOT NULL,
    "route_url" TEXT NOT NULL,
    "route_color" TEXT NOT NULL,
    "route_text_color" TEXT NOT NULL,

    CONSTRAINT "Routes_pkey" PRIMARY KEY ("route_id")
);

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Routes"("route_id") ON DELETE RESTRICT ON UPDATE CASCADE;
