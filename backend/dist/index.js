"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const client_1 = require("@prisma/client");
const UserResolver_1 = __importDefault(require("./resolvers/UserResolver"));
const typeDefs_1 = __importDefault(require("./types/typeDefs"));
exports.prisma = new client_1.PrismaClient();
const resolvers = [UserResolver_1.default];
const server = new server_1.ApolloServer({
    typeDefs: typeDefs_1.default,
    resolvers,
});
(0, standalone_1.startStandaloneServer)(server).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
//# sourceMappingURL=index.js.map