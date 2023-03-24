"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const typeDefs = `#graphql
    type Query {
        get: String
    }
    type Mutation {
        create: String
        delete: String
        update: String
    }
`;
const resolvers = {
    Query: {
        get: () => "get messages",
    },
    Mutation: {
        create: () => "create message",
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