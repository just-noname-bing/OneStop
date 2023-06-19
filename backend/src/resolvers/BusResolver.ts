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
            return await prisma.routes.findMany({});
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
            return await prisma.shapes.findMany({});
        },

        Stops: async (): Promise<Stops[]> => {
            return await prisma.stops.findMany({});
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

        getRoutesForMultipleStops: async (_p: any, args: any, _ctx: any) => {
            const { stop_ids } = args as { stop_ids: string[] };

            console.log(stop_ids);
            const stops = await prisma.stops.findMany({
                where: {
                    stop_id: { in: stop_ids },
                },
            });

            // const newDataset = await prisma.routes

            const joined = [];

            const currentDate = new Date();
            const isWorkking = isWorkingDay(currentDate);
            for (let stop of stops) {
                const routes = await prisma.routes.findMany({
                    where: {
                        trips: {
                            some: {
                                stop_times: {
                                    some: { stop_id: stop.stop_id },
                                },
                            },
                        },
                    },
                });

                const includeStopTimes = [];
                for (let r of routes) {
                    const test = await prisma.stop_times.findMany({
                        where: {
                            AND: [
                                { stop_id: stop.stop_id },
                                { trips: { route_id: r.route_id } },
                                {
                                    trips: {
                                        Calendar: {
                                            friday: {
                                                equals: isWorkking ? "1" : "0",
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                        include: { trips: true },
                    });

                    includeStopTimes.push({ ...r, stop_times: test });
                }

                joined.push({ ...stop, routes: includeStopTimes });
            }

            console.dir(joined, { depth: null });

            return joined;
        },

        getRoutesForStop: async (_p: any, args: any, _ctx: any) => {
            const { stop_id } = args as { stop_id: string };

            const SpecificRoutes = await prisma.routes.findMany({
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

            const newDataset = [
                // route
                // Stop_times
            ];

            // params
            // stopId
            // currentDay
            //

            const currentDate = new Date();
            const isWorkking = isWorkingDay(currentDate);
            for (let r of SpecificRoutes) {
                const test = await prisma.stop_times.findMany({
                    where: {
                        AND: [
                            { stop_id },
                            { trips: { route_id: r.route_id } },
                            {
                                trips: {
                                    Calendar: {
                                        friday: {
                                            equals: isWorkking ? "1" : "0",
                                        },
                                    },
                                },
                            },
                        ],
                    },
                    orderBy: [
                        { trips: { service_id: "asc" } },
                        { arrival_time: "asc" },
                    ],
                });

                newDataset.push({
                    Routes: r,
                    Stop_times: getTwoClosestTimes(test),
                });
            }

            console.dir(newDataset, { depth: null });

            return newDataset;
        },

        stopsSearch: async (_p: any, args: any, _ctx: any) => {
            const { stop_name } = args as { stop_name: string };
            const stops = await prisma.stops.findMany({
                where: {
                    stop_name: {
                        contains: stop_name,
                        mode: "insensitive",
                    },
                },
            });

            const joined = [];
            for (let stop of stops) {
                const routes = await prisma.routes.findMany({
                    where: {
                        trips: {
                            some: {
                                stop_times: {
                                    some: { stop_id: stop.stop_id },
                                },
                            },
                        },
                    },
                });
                joined.push({ ...stop, route: routes });
            }

            return joined;
        },

        getTransportDirectionStops: async (_p: any, args: any, _ctx: any) => {
            const { transport_id } = args as {
                transport_id: string;
            };

            return await prisma.routes.findFirst({
                where: { route_id: transport_id },
                include: {
                    trips: {
                        distinct: "shape_id",
                        include: {
                            stop_times: {
                                distinct: ["stop_id", "trip_id"],
                                include: { stops: true },
                            },
                        },
                    },
                },
            });
        },
    },

    Mutation: {
        getTransportSchedule: async (_p: any, args: any, _ctx: any) => {
            const { stop_id, transport_id } = args as {
                stop_id: string;
                transport_id: string;
            };

            const x = await prisma.stop_times.findMany({
                where: {
                    AND: [{ stop_id }, { trips: { route_id: transport_id } }],
                },
                include: { trips: { include: { Calendar: true } } },
                orderBy: [{ arrival_time: "asc" }],
            });
            return x;
        },
    },
};

function getTwoClosestTimes(test: Stop_times[]) {
    const currentTime = new Date(); // Current time
    const twoClosestTimes = test
        .slice()
        .sort((a, b) => {
            const aa = a.arrival_time.split(":");
            const bb = b.arrival_time.split(":");

            const hourDiff = Number(aa[0]) - Number(bb[0]);
            if (hourDiff !== 0) {
                return hourDiff; // Sort by hours if they are different
            }

            const minuteDiff = Number(aa[1]) - Number(bb[1]);
            return minuteDiff; // Sort by minutes if hours are the same
        })
        .filter((sche) => {
            const [hours, mins] = sche.arrival_time.split(":");

            if (currentTime.getHours() < Number(hours)) {
                return true;
            } else if (
                currentTime.getHours() <= Number(hours) &&
                currentTime.getMinutes() <= Number(mins)
            ) {
                return true;
            }

            return false;
        });
    return twoClosestTimes;
}

function isWorkingDay(date: Date) {
    const dayOfWeek = date.getDay();
    return dayOfWeek >= 1 && dayOfWeek <= 5; // Monday to Friday (1-5)
}
