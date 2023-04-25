"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const express4_1 = require("@apollo/server/express4");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const body_parser_1 = require("body-parser");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const jsonwebtoken_1 = require("jsonwebtoken");
const UserResolver_1 = __importDefault(require("./resolvers/UserResolver"));
const typeDefs_1 = __importDefault(require("./types/typeDefs"));
const TokenService_1 = require("./utils/TokenService");
const constants_1 = require("./utils/constants");
(async () => {
    const app = (0, express_1.default)();
    const httpServer = http_1.default.createServer(app);
    app.use((0, body_parser_1.json)());
    app.post("/refresh_token", async (req, res) => {
        const { token } = req.body;
        try {
            const { role, userId, verified } = (0, jsonwebtoken_1.verify)(token, constants_1.refreshToken_secret);
            const oldToken = await constants_1.prisma.refreshTokens.findFirst({
                where: { userId },
            });
            if (!oldToken || oldToken.token !== token)
                return res.sendStatus(401);
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
        resolvers: [UserResolver_1.default],
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer })],
    });
    await server.start();
    app.use("/", (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => ({ auth: req.headers.authorization }),
    }));
    httpServer.listen({ port: constants_1.server_port });
    console.log(`🚀 Server ready at http://localhost:${constants_1.server_port}/`);
})();
//# sourceMappingURL=index.js.map