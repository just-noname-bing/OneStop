import "dotenv-safe/config"
import { ApolloServer } from "@apollo/server";
import { expressMiddleware as expressM } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { hash } from "bcrypt";
import { json } from "body-parser";
import express from "express";
import http from "http";
import { verify } from "jsonwebtoken";
import { BusResolver } from "./resolvers/BusResolver";
import PostResolver from "./resolvers/PostResolver";
import UserResolver from "./resolvers/UserResolver";
import { PASSWORD_INPUT_SCHEMA } from "./types";
import typeDefs from "./types/typeDefs";
import { EmailTokenPayload } from "./utils/EmailService";
import {
    TokenPayload,
    generateAccessToken,
    generateRefreshToken,
} from "./utils/TokenService";
import {
    DOMAIN,
    EMAIL_VERIFICATION_TOKEN_SECRET,
    EXPO_URL,
    PASSWORD_SALT_ROUNDS,
    REFRESH_TOKEN_SECRET,
    SERVER_PORT,
    prisma,
} from "./utils/constants";
import defaultAdmin from "./utils/defaultAdmin";
import validateSchema from "./utils/validateSchema";

(async () => {
    console.log(process.env.DATABASE_URL);

    try {
        await prisma.$connect();
        console.log("Connected to the database");
    } catch (err) {
        return console.log("Could not connect to the database ", err);
    }

    await prisma.user.deleteMany({}); // reheheha

    await defaultAdmin(); // will create a default admin if not exists

    const app = express();
    const http_server = http.createServer(app);

    app.use(json());

    app.get("/expo/redirect/:path/:token", (req, res) => {
        const expoUrl = `${EXPO_URL}/--/${req.params.path}?token=${req.params.token}`;
        res.status(200).redirect(expoUrl);
    });

    app.post("/confirm/verify_email", async (req, res) => {
        const { token } = req.body;
        // to add more security layers we can verify access token too
        if (!token)
            return res.status(401).json({ ok: false, error: "token required" });

        try {
            const { userId } = verify(
                token,
                EMAIL_VERIFICATION_TOKEN_SECRET
            ) as EmailTokenPayload;
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
    });

    app.post("/confirm/forgot_password", async (req, res) => {
        const { token, password } = req.body;
        console.log(token, password)

        try {
            const { userId } = verify(
                token,
                EMAIL_VERIFICATION_TOKEN_SECRET
            ) as EmailTokenPayload;
            const users_token = await prisma.forgotPasswordTokens.findFirst({
                where: { userId },
            });

            if (users_token && users_token.token === token) {
                const errors = await validateSchema(PASSWORD_INPUT_SCHEMA, {
                    password,
                });

                if (errors.length) {
                    res.json({ ok: false, errors });
                }

                // update password -> delete token

                await prisma.$transaction([
                    prisma.user.update({
                        where: { id: userId },
                        data: {
                            password: await hash(
                                password,
                                PASSWORD_SALT_ROUNDS
                            ),
                        },
                    }),
                    prisma.forgotPasswordTokens.delete({ where: { userId } }),
                    prisma.refreshTokens.delete({ where: { userId } }),
                ]);

                return res.json({ ok: true });
            }
        } catch (err) { }
        return res.json({
            ok: false,
            errors: [{ field: "password", message: "bad token" }],
        });
    });

    app.post("/refresh_token", async (req, res) => {
        const { token } = req.body;

        try {
            const { role, userId, verified } = verify(
                token,
                REFRESH_TOKEN_SECRET
            ) as TokenPayload;
            const user_tokens = await prisma.refreshTokens.findFirst({
                where: { userId },
            });

            if (!user_tokens || !user_tokens.token.includes(token))
                return res.sendStatus(401);

            // token exists and not expired
            // delete old token
            await prisma.refreshTokens.update({
                where: { userId },
                data: { token: user_tokens.token.filter((x) => x !== token) },
            });

            return res.json({
                accessToken: generateAccessToken({ role, userId, verified }),
                refreshToken: await generateRefreshToken({
                    role,
                    userId,
                    verified,
                }),
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
        plugins: [
            ApolloServerPluginDrainHttpServer({ httpServer: http_server }),
        ],
    });

    await server.start();

    app.use(
        "/",
        expressM(server, {
            context: async ({ req }) => ({ auth: req.headers.authorization }),
        })
    );

    // Modified server startup
    http_server.listen({ port: SERVER_PORT });
    console.log(`🚀 Server ready at ${DOMAIN}/`);
})();
