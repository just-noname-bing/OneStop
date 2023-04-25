import { Roles } from "@prisma/client";
import { sign } from "jsonwebtoken";
import { accessToken_secret, prisma, refreshToken_secret } from "./constants";

export interface TokenPayload {
	userId: string;
	role: Roles;
	verified: boolean;
}

export const generateAccessToken = (payload: TokenPayload) => {
	return sign(payload, accessToken_secret, { expiresIn: "1m" });
};

export const generateRefreshToken = async (payload: TokenPayload) => {
	// save every new token to database
	const refreshToken = sign(payload, refreshToken_secret, { expiresIn: "5m" });

	await prisma.refreshTokens.upsert({
		where: { userId: payload.userId },
		create: { token: refreshToken, userId: payload.userId },
		update: { token: refreshToken },
	});

	return refreshToken;
};
