/*
  Warnings:

  - Added the required column `route_sort_order` to the `Routes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Routes" ADD COLUMN     "route_sort_order" TEXT NOT NULL;
