"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusResolver = void 0;
const constants_1 = require("../utils/constants");
exports.BusResolver = {
    Query: {
        Routes: async () => await constants_1.prisma.routes.findMany(),
        Trips: async () => await constants_1.prisma.trips.findMany(),
        Shapes: async () => await constants_1.prisma.shapes.findMany(),
        Stops: async () => await constants_1.prisma.stops.findMany(),
        Stop_times: async () => await constants_1.prisma.stop_times.findMany(),
        Calendar: async () => await constants_1.prisma.calendar.findMany(),
        Calendar_dates: async () => await constants_1.prisma.calendar_dates.findMany(),
    },
};
//# sourceMappingURL=BusResolver.js.map