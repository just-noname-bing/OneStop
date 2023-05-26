import { Calendar, Calendar_dates, Routes, Shapes, Stop_times, Stops, Trips } from "@prisma/client";
import { prisma } from "../utils/constants";

export const BusResolver = {
    Query: {
        Routes: async (): Promise<Routes[]> => await prisma.routes.findMany({
            include: { trips: true, posts: true }
        }),
        Trips: async (): Promise<Trips[]> => await prisma.trips.findMany({
            include: { Shapes: true, stop_times: true, Calendar: true, route: true }
        }),
        Shapes: async (): Promise<Shapes[]> => await prisma.shapes.findMany({
            include: { trips: true }
        }),
        Stops: async (): Promise<Stops[]> => await prisma.stops.findMany({
            include: { stop_times: true }
        }),
        Stop_times: async (): Promise<Stop_times[]> => await prisma.stop_times.findMany({
            include: { trips: true, stops: true }
        }),
        Calendar: async (): Promise<Calendar[]> => await prisma.calendar.findMany({
            include: {
                trips: true,
                calendar_dates: true
            }
        }),
        Calendar_dates: async (): Promise<Calendar_dates[]> =>
            await prisma.calendar_dates.findMany({
                include: {
                    Calendar: true,
                }
            }),
    },
    Mutation: {
        stopsSearch: async (_p: any, args: any, _ctx: any) => {
            const { stop_name } = args as { stop_name: string }
            return await prisma.stops.findMany({
                where: { stop_name: { contains: stop_name, mode: "insensitive" } },
                include: {
                    stop_times: true
                }
            })
        }
    }
};
