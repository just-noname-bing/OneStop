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

        getRoutesForStop: async (_p: any, args: any, _ctx: any) => {
            const { stop_id } = args as { stop_id: string };

            // const test = await prisma.stop_times.findMany({
            //     where: {
            //         AND: [{ stop_id }, { trips: { route_id: "riga_bus_41" } }],
            //     },
            //     orderBy: [
            //         { trips: { service_id: "asc" } },
            //         { arrival_time: "asc" },
            //     ],
            // });

            // stop
            // route
            // shclue

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
    },

    Mutation: {
        getTransportDirectionStops: async (_p: any, args: any, _ctx: any) => {
            const { transport_id, order } = args as {
                order: string;
                transport_id: string;
            };

            // const directions = await prisma.trips.findMany({
            //     where: {
            //         route_id: transport_id,
            //     },
            //     distinct: ["shape_id"],
            //     include: { route: true },
            // });
            //
            // console.log(directions)
            //
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
                include: { stops: true },
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

            return raw3;
        },
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

            const joined = []
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
                joined.push({...stop, route: routes})
            }
            console.dir(joined, {depth:null});
            return stops;
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
