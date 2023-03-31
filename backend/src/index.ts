import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// The GraphQL schema
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

// A map of functions which return data for the schema.
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
			} catch (error) {
				//uniqeu -> return error
				if (error.code === "P2002") {
					console.error("[ERROr] unique");
				}

				// something went wrong
				return null;
			}
		},
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
