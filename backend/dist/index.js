"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const typeDefs = `#graphql
    type Query {
        get: [User]
    }
    type Mutation {
        create: User
        delete: String
        update: String
    }

    type User {
        id:String
        username:String
    }
`;
const resolvers = {
    Query: {
        get: async () => {
            return await prisma.user.findMany();
        },
    },
    Mutation: {
        create: async () => {
            try {
                return await prisma.user.create({
                    data: {
                        username: "a",
                    },
                });
            }
            catch (error) {
                if (error.code === "P2002") {
                    console.error("[ERROr] unique");
                }
                return null;
            }
        },
        delete: () => "delete message",
        update: () => "update message",
    },
};
const server = new server_1.ApolloServer({
    typeDefs,
    resolvers,
});
(0, standalone_1.startStandaloneServer)(server).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
//# sourceMappingURL=index.js.map