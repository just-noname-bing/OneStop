import { Calendar, Calendar_dates, Routes, Shapes, Stop_times, Stops, Trips } from "@prisma/client";
import { prisma } from "../utils/constants";

export const BusResolver = {
	Query: {
		Routes: async (): Promise<Routes[]> => await prisma.routes.findMany(),
		Trips: async (): Promise<Trips[]> => await prisma.trips.findMany(),
		Shapes: async (): Promise<Shapes[]> => await prisma.shapes.findMany(),
		Stops: async (): Promise<Stops[]> => await prisma.stops.findMany(),
		Stop_times: async (): Promise<Stop_times[]> => await prisma.stop_times.findMany(),
		Calendar: async (): Promise<Calendar[]> => await prisma.calendar.findMany(),
		Calendar_dates: async (): Promise<Calendar_dates[]> =>
			await prisma.calendar_dates.findMany(),
	},
};
