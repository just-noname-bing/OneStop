"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const constants_1 = require("./constants");
const generateAccessToken = (payload) => {
    return (0, jsonwebtoken_1.sign)(payload, constants_1.ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
};
exports.generateAccessToken = generateAccessToken;
const generateRefreshToken = async (payload) => {
    const refreshToken = (0, jsonwebtoken_1.sign)(payload, constants_1.REFRESH_TOKEN_SECRET, { expiresIn: "50m" });
    await constants_1.prisma.refreshTokens.upsert({
        where: { userId: payload.userId },
        create: { token: [refreshToken], userId: payload.userId },
        update: { token: { push: refreshToken } },
    });
    return refreshToken;
};
exports.generateRefreshToken = generateRefreshToken;
//# sourceMappingURL=TokenService.js.map