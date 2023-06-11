import {
    Calendar,
    Calendar_dates,
    Routes,
    Shapes,
    Stop_times,
    Stops,
    Trips,
} from "@prisma/client";
import { prisma } from "../utils/constants";

export const BusResolver = {
    Query: {
        Routes: async (): Promise<Routes[]> => {
            return await prisma.routes.findMany({
                include: {
                    trips: true,
                    posts: true,
                },
            });
        },

        Trips: async (): Promise<Trips[]> => {
            return await prisma.trips.findMany({
                include: {
                    Shapes: true,
                    stop_times: true,
                    Calendar: true,
                    route: true,
                },
            });
        },

        Shapes: async (): Promise<Shapes[]> => {
            return await prisma.shapes.findMany({
                include: { trips: true },
            });
        },

        Stops: async (): Promise<Stops[]> => {
            return await prisma.stops.findMany({
                include: {
                    stop_times: {
                        include: {
                            trips: {
                                include: {
                                    Shapes: true,
                                    route: true,
                                    Calendar: true,
                                },
                            },
                        },
                    },
                },
            });
        },

        Stop_times: async (): Promise<Stop_times[]> => {
            return await prisma.stop_times.findMany({
                include: { trips: true, stops: true },
            });
        },

        Calendar: async (): Promise<Calendar[]> => {
            return await prisma.calendar.findMany({
                include: {
                    trips: true,
                    calendar_dates: true,
                },
            });
        },

        Calendar_dates: async (): Promise<Calendar_dates[]> =>
            await prisma.calendar_dates.findMany({
                include: {
                    Calendar: true,
                },
            }),
    },

    Mutation: {
        getTransportDirectionStops: async (_p: any, args: any, _ctx: any) => {
            const { transport_id, order } = args as {
                order: string;
                transport_id: string;
            };

            const raw2 = await prisma.trips.findFirst({
                where: {
                    route_id: transport_id,
                    direction_id: order,
                },
                distinct: ["trip_id"],
            });

            const raw3 = await prisma.stop_times.findMany({
                where: {
                    trip_id: raw2?.trip_id,
                },
                orderBy: { stop_sequence: "asc" },
                include: { stops: { select: { stop_name: true } } },
            });

            raw3.sort((a, b) => {
                const aa = Number(a.stop_sequence);
                const bb = Number(b.stop_sequence);
                if (aa < bb) {
                    return -1;
                } else if (aa > bb) {
                    return 1;
                }
                return 0;
            });

            console.dir(raw2, { depth: null });

            return raw3;
        },
        getTransportSchedule: async (_p: any, args: any, _ctx: any) => {
            const { stop_id, transport_id } = args as {
                stop_id: string;
                transport_id: string;
            };
            return await prisma.stop_times.findMany({
                where: {
                    AND: [{ stop_id }, { trips: { route_id: transport_id } }],
                },
                include: { trips: { include: { Calendar: true } } },
                orderBy: [
                    { trips: { service_id: "asc" } },
                    { arrival_time: "asc" },
                ],
            });
        },
        getRoutesForStop: async (_p: any, args: any, _ctx: any) => {
            const { stop_id } = args as { stop_id: string };

            return await prisma.routes.findMany({
                where: {
                    trips: {
                        some: {
                            stop_times: {
                                some: { stop_id },
                            },
                        },
                    },
                },
            });
        },
        stopsSearch: async (_p: any, args: any, _ctx: any) => {
            const { stop_name } = args as { stop_name: string };
            return await prisma.stops.findMany({
                where: {
                    stop_name: {
                        contains: stop_name,
                        mode: "insensitive",
                    },
                },
                include: {
                    stop_times: {
                        include: {
                            trips: {
                                include: {
                                    Shapes: true,
                                    Calendar: true,
                                    route: true,
                                },
                            },
                        },
                    },
                },
            });
        },
    },
};
