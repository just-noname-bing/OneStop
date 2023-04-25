import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export const server_port = process.env.PORT;
export const accessToken_secret = "bombobmbombombombobmobmaaab";
export const refreshToken_secret = "wwawawwwweweewweaweweawe";
export const emailVerificationToken_secret = "ssbaisoysdbisdobybsdye3095";
export const pswSaltRounds = 10;
