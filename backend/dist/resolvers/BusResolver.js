"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusResolver = void 0;
const constants_1 = require("../utils/constants");
exports.BusResolver = {
    Query: {
        Routes: async () => await constants_1.prisma.routes.findMany({
            include: { trips: true, posts: true }
        }),
        Trips: async () => await constants_1.prisma.trips.findMany({
            include: { Shapes: true, stop_times: true, Calendar: true, route: true }
        }),
        Shapes: async () => await constants_1.prisma.shapes.findMany({
            include: { trips: true }
        }),
        Stops: async () => await constants_1.prisma.stops.findMany({
            include: { stop_times: true }
        }),
        Stop_times: async () => await constants_1.prisma.stop_times.findMany({
            include: { trips: true, stops: true }
        }),
        Calendar: async () => await constants_1.prisma.calendar.findMany({
            include: {
                trips: true,
                calendar_dates: true
            }
        }),
        Calendar_dates: async () => await constants_1.prisma.calendar_dates.findMany({
            include: {
                Calendar: true,
            }
        }),
    },
    Mutation: {
        stopsSearch: async (_p, args, _ctx) => {
            const { stop_name } = args;
            return await constants_1.prisma.stops.findMany({
                where: { stop_name: { contains: stop_name, mode: "insensitive" } },
                include: {
                    stop_times: true
                }
            });
        }
    }
};
//# sourceMappingURL=BusResolver.js.map