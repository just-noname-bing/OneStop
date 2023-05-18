import { Roles } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, prisma, REFRESH_TOKEN_SECRET } from "./constants";

export interface TokenPayload {
    userId: string;
    role: Roles;
    verified: boolean;
}

export const generateAccessToken = (payload: TokenPayload) => {
    return sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "10m" });
};

export const generateRefreshToken = async (payload: TokenPayload) => {
    // save every new token to database
    // add new token to array
    const refreshToken = sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "50m" });

    await prisma.refreshTokens.upsert({
        where: { userId: payload.userId },
        create: { token: [refreshToken], userId: payload.userId },
        update: { token: { push: refreshToken } },
    });

    return refreshToken;
};
