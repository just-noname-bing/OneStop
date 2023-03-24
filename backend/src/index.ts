import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// The GraphQL schema
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

// A map of functions which return data for the schema.
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

const server = new ApolloServer({
	typeDefs,
	resolvers,
});

startStandaloneServer(server).then(({ url }) => {
	console.log(`🚀 Server ready at ${url}`);
});
