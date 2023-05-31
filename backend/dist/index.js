"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const bcrypt_1 = require("bcrypt");
const body_parser_1 = require("body-parser");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const jsonwebtoken_1 = require("jsonwebtoken");
const BusResolver_1 = require("./resolvers/BusResolver");
const PostResolver_1 = __importDefault(require("./resolvers/PostResolver"));
const UserResolver_1 = __importDefault(require("./resolvers/UserResolver"));
const types_1 = require("./types");
const typeDefs_1 = __importDefault(require("./types/typeDefs"));
const TokenService_1 = require("./utils/TokenService");
const constants_1 = require("./utils/constants");
const defaultAdmin_1 = __importDefault(require("./utils/defaultAdmin"));
const validateSchema_1 = __importDefault(require("./utils/validateSchema"));
(async () => {
    try {
        await constants_1.prisma.$connect();
        console.log("Connected to the database");
    }
    catch (err) {
        return console.log("Could not connect to the database ", err);
    }
    await (0, defaultAdmin_1.default)();
    const app = (0, express_1.default)();
    const http_server = http_1.default.createServer(app);
    app.use((0, body_parser_1.json)());
    app.post("/confirm/verify_email", async (req, res) => {
        const { token } = req.body;
        if (!token)
            return res.status(401).json({ ok: false, error: "token required" });
        try {
            const { userId } = (0, jsonwebtoken_1.verify)(token, constants_1.EMAIL_VERIFICATION_TOKEN_SECRET);
            await constants_1.prisma.user.update({
                data: { verified: true },
                where: { id: userId },
            });
            return res.status(200).json({ ok: true });
        }
        catch (error) {
            return res.status(401).json({ ok: false, error: "bad token" });
        }
    });
    app.post("/confirm/forgot_password", async (req, res) => {
        const { token, password } = req.body;
        try {
            const { userId } = (0, jsonwebtoken_1.verify)(token, constants_1.EMAIL_VERIFICATION_TOKEN_SECRET);
            const users_token = await constants_1.prisma.forgotPasswordTokens.findFirst({ where: { userId } });
            if (users_token && users_token.token === token) {
                const errors = await (0, validateSchema_1.default)(types_1.PASSWORD_INPUT_SCHEMA, { password });
                if (errors.length) {
                    res.json({ ok: false, errors });
                }
                await constants_1.prisma.$transaction([
                    constants_1.prisma.user.update({
                        where: { id: userId },
                        data: { password: await (0, bcrypt_1.hash)(password, constants_1.PASSWORD_SALT_ROUNDS) },
                    }),
                    constants_1.prisma.forgotPasswordTokens.delete({ where: { userId } }),
                    constants_1.prisma.refreshTokens.delete({ where: { userId } }),
                ]);
                return res.json({ ok: true });
            }
        }
        catch (err) { }
        return res.json({
            ok: false,
            errors: [{ field: "password", message: "bad token" }],
        });
    });
    app.post("/refresh_token", async (req, res) => {
        const { token } = req.body;
        try {
            const { role, userId, verified } = (0, jsonwebtoken_1.verify)(token, constants_1.REFRESH_TOKEN_SECRET);
            const user_tokens = await constants_1.prisma.refreshTokens.findFirst({
                where: { userId },
            });
            if (!user_tokens || !user_tokens.token.includes(token))
                return res.sendStatus(401);
            await constants_1.prisma.refreshTokens.update({
                where: { userId },
                data: { token: user_tokens.token.filter((x) => x !== token) },
            });
            return res.json({
                accessToken: (0, TokenService_1.generateAccessToken)({ role, userId, verified }),
                refreshToken: await (0, TokenService_1.generateRefreshToken)({ role, userId, verified }),
            });
        }
        catch (error) {
            console.log(error);
            return res.sendStatus(401);
        }
    });
    const server = new server_1.ApolloServer({
        typeDefs: typeDefs_1.default,
        resolvers: [UserResolver_1.default, BusResolver_1.BusResolver, PostResolver_1.default],
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer: http_server })],
    });
    await server.start();
    app.use("/", (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => ({ auth: req.headers.authorization }),
    }));
    http_server.listen({ port: constants_1.SERVER_PORT });
    console.log(`🚀 Server ready at http://localhost:${constants_1.SERVER_PORT}/`);
})();
//# sourceMappingURL=index.js.map