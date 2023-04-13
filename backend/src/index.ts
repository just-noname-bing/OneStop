import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";
import UserResolver from "./resolvers/UserResolver";
import typeDefs from "./types/typeDefs";

export const prisma = new PrismaClient();

// The GraphQL schema

// A map of functions which return data for the schema.
const resolvers = [UserResolver];

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

startStandaloneServer(server).then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});
