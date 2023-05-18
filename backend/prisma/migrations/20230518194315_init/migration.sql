-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('DEFAULT', 'MODERATOR', 'ADMIN');

-- CreateTable
CREATE TABLE "refreshTokens" (
    "userId" TEXT NOT NULL,
    "token" TEXT[],

    CONSTRAINT "refreshTokens_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "forgotPasswordTokens" (
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "forgotPasswordTokens_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Roles" NOT NULL DEFAULT 'DEFAULT',
    "surname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "transport_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "postId" TEXT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

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
    "route_sort_order" TEXT NOT NULL,

    CONSTRAINT "Routes_pkey" PRIMARY KEY ("route_id")
);

-- CreateTable
CREATE TABLE "Trips" (
    "route_id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    "trip_headsign" TEXT NOT NULL,
    "direction_id" TEXT NOT NULL,
    "block_id" TEXT NOT NULL,
    "shape_id" TEXT NOT NULL,
    "wheelchair_accessible" TEXT NOT NULL,
    "shapesShape_id" TEXT,
    "shapesShape_dist_traveled" TEXT,
    "calendarService_id" TEXT,

    CONSTRAINT "Trips_pkey" PRIMARY KEY ("trip_id")
);

-- CreateTable
CREATE TABLE "Shapes" (
    "shape_id" TEXT NOT NULL,
    "shape_pt_lat" TEXT NOT NULL,
    "shape_pt_lon" TEXT NOT NULL,
    "shape_pt_sequence" TEXT NOT NULL,
    "shape_dist_traveled" TEXT NOT NULL,

    CONSTRAINT "Shapes_pkey" PRIMARY KEY ("shape_id","shape_dist_traveled")
);

-- CreateTable
CREATE TABLE "Stops" (
    "stop_id" TEXT NOT NULL,
    "stop_code" TEXT NOT NULL,
    "stop_name" TEXT NOT NULL,
    "stop_desc" TEXT NOT NULL,
    "stop_lat" TEXT NOT NULL,
    "stop_lon" TEXT NOT NULL,
    "stop_url" TEXT NOT NULL,
    "location_type" TEXT NOT NULL,
    "parent_station" TEXT NOT NULL,

    CONSTRAINT "Stops_pkey" PRIMARY KEY ("stop_id")
);

-- CreateTable
CREATE TABLE "Stop_times" (
    "trip_id" TEXT NOT NULL,
    "arrival_time" TEXT NOT NULL,
    "departure_time" TEXT NOT NULL,
    "stop_id" TEXT NOT NULL,
    "stop_sequence" TEXT NOT NULL,
    "pickup_type" TEXT NOT NULL,
    "drop_off_type" TEXT NOT NULL,

    CONSTRAINT "Stop_times_pkey" PRIMARY KEY ("trip_id","stop_id")
);

-- CreateTable
CREATE TABLE "Calendar" (
    "service_id" TEXT NOT NULL,
    "monday" TEXT NOT NULL,
    "tuesday" TEXT NOT NULL,
    "wednesday" TEXT NOT NULL,
    "thursday" TEXT NOT NULL,
    "friday" TEXT NOT NULL,
    "saturday" TEXT NOT NULL,
    "sunday" TEXT NOT NULL,
    "start_date" TEXT NOT NULL,
    "end_date" TEXT NOT NULL,

    CONSTRAINT "Calendar_pkey" PRIMARY KEY ("service_id")
);

-- CreateTable
CREATE TABLE "Calendar_dates" (
    "service_id" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "exception_type" TEXT NOT NULL,

    CONSTRAINT "Calendar_dates_pkey" PRIMARY KEY ("service_id","date")
);

-- CreateIndex
CREATE UNIQUE INDEX "refreshTokens_userId_key" ON "refreshTokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "forgotPasswordTokens_userId_key" ON "forgotPasswordTokens"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_transport_id_fkey" FOREIGN KEY ("transport_id") REFERENCES "Routes"("route_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_route_id_fkey" FOREIGN KEY ("route_id") REFERENCES "Routes"("route_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_shapesShape_id_shapesShape_dist_traveled_fkey" FOREIGN KEY ("shapesShape_id", "shapesShape_dist_traveled") REFERENCES "Shapes"("shape_id", "shape_dist_traveled") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trips" ADD CONSTRAINT "Trips_calendarService_id_fkey" FOREIGN KEY ("calendarService_id") REFERENCES "Calendar"("service_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stop_times" ADD CONSTRAINT "Stop_times_stop_id_fkey" FOREIGN KEY ("stop_id") REFERENCES "Stops"("stop_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stop_times" ADD CONSTRAINT "Stop_times_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "Trips"("trip_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calendar_dates" ADD CONSTRAINT "Calendar_dates_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "Calendar"("service_id") ON DELETE RESTRICT ON UPDATE CASCADE;
