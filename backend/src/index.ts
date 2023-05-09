import { ApolloServer } from "@apollo/server";
import { expressMiddleware as expressM } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { json } from "body-parser";
import express from "express";
import http from "http";
import { verify } from "jsonwebtoken";
import { BusResolver } from "./resolvers/BusResolver";
import UserResolver from "./resolvers/UserResolver";
import typeDefs from "./types/typeDefs";
import { TokenPayload, generateAccessToken, generateRefreshToken } from "./utils/TokenService";
import { emailVerificationToken_secret, prisma, pswSaltRounds, refreshToken_secret, server_port } from "./utils/constants";
import PostResolver from "./resolvers/PostResolver";
import ValidateSchema from "./utils/validateSchema";
import { PasswordInputSchema } from "./types";
import { EmailTokenPayload } from "./utils/EmailService";
import { hash } from "bcrypt";

(async () => {

    try {
        await prisma.$connect()
        console.log("Connected to the database")
    } catch (err) {
        return console.log("Could not connect to the database ", err)
    }

    const app = express();
    const httpServer = http.createServer(app);

    app.use(json());


    app.post("/confirm/verify_email", async (req, res) => {
        const { token } = req.body;
        // to add more security layers we can verify access token too
        if (!token) return res.status(401).json({ ok: false, error: "token required" });;

        try {
            const { userId } = verify(token, emailVerificationToken_secret) as EmailTokenPayload;
            // change verified in database
            // if no user
            // this will throw an error
            await prisma.user.update({
                data: { verified: true },
                where: { id: userId },
            });

            return res.status(200).json({ ok: true });
        } catch (error) {
            // if (error.code === "TokenExpiredError") {
            // 	return ;
            // }
            return res.status(401).json({ ok: false, error: "bad token" });
        }
    })

    app.post("/confirm/forgot_password", async (req, res) => {
        const { token, password } = req.body

        try {
            const { userId } = verify(token, emailVerificationToken_secret) as EmailTokenPayload
            const usersToken = await prisma.forgotPasswordTokens.findFirst({ where: { userId } })

            if (usersToken && usersToken.token === token) {
                const errors = await ValidateSchema(PasswordInputSchema, { password })

                if (errors.length) {
                    res.json({ ok: false, errors })
                }

                // update password -> delete token

                await prisma.$transaction([
                    prisma.user.update({
                        where: { id: userId },
                        data: { password: await hash(password, pswSaltRounds) }
                    }),
                    prisma.forgotPasswordTokens.delete({ where: { userId } }),
                    prisma.refreshTokens.delete({ where: { userId } })
                ])

                return res.json({ ok: true })
            }

        } catch (err) { }
        return res.json({
            ok: false,
            errors: [{ field: "password", message: "bad token" }]
        })
    })

    app.post("/refresh_token", async (req, res) => {
        const { token } = req.body;

        try {
            const { role, userId, verified } = verify(token, refreshToken_secret) as TokenPayload;
            const userTokens = await prisma.refreshTokens.findFirst({
                where: { userId },
            });

            if (!userTokens || !userTokens.token.includes(token)) return res.sendStatus(401);

            // token exists and not expired
            // delete old token
            await prisma.refreshTokens.update({
                where: { userId },
                data: { token: userTokens.token.filter((x) => x !== token) },
            });

            return res.json({
                accessToken: generateAccessToken({ role, userId, verified }),
                refreshToken: await generateRefreshToken({ role, userId, verified }),
            });
        } catch (error) {
            console.log(error);

            // delete token if expired
            // create a worker that will remove expired tokens
            // if (error.code === "TokenExpiredError") {
            // }

            return res.sendStatus(401);
        }
    });

    const server = new ApolloServer({
        typeDefs,
        resolvers: [UserResolver, BusResolver, PostResolver],
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
