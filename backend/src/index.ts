// npm install
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as expressM } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { json } from "body-parser";
import express from "express";
import http from "http";
import { verify } from "jsonwebtoken";
import UserResolver from "./resolvers/UserResolver";
import typeDefs from "./types/typeDefs";
import { TokenPayload, generateAccessToken, generateRefreshToken } from "./utils/TokenService";
import { prisma, refreshToken_secret, server_port } from "./utils/constants";

(async () => {
	const app = express();
	const httpServer = http.createServer(app);

	app.use(json());

	app.post("/refresh_token", async (req, res) => {
		const { token } = req.body;

		try {
			const { role, userId, verified } = verify(token, refreshToken_secret) as TokenPayload;
			const oldToken = await prisma.refreshTokens.findFirst({
				where: { userId },
			});

			if (!oldToken || oldToken.token !== token) return res.sendStatus(401);

			// token is valid and contains correct userId
			// create new tokens

			return res.json({
				accessToken: generateAccessToken({ role, userId, verified }),
				refreshToken: await generateRefreshToken({ role, userId, verified }),
			});
		} catch (error) {
			console.log(error);

			return res.sendStatus(401);
		}
	});

	const server = new ApolloServer({
		typeDefs,
		resolvers: [UserResolver],
		plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
	});

	await server.start();

	app.use(
		"/",
		expressM(server, {
			context: async ({ req }) => ({ auth: req.headers.authorization }),
		})
	);

	// Modified server startup
	httpServer.listen({ port: server_port });
	console.log(`🚀 Server ready at http://localhost:${server_port}/`);
})();
