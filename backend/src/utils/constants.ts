import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
export const SERVER_PORT = process.env.PORT;
export const ACCESS_TOKEN_SECRET = "bombobmbombombombobmobmaaab";
export const REFRESH_TOKEN_SECRET = "wwawawwwweweewweaweweawe";
export const EMAIL_VERIFICATION_TOKEN_SECRET = "ssbaisoysdbisdobybsdye3095";
export const PASSWORD_SALT_ROUNDS = 10;
// remove this and add this to the .env file
export const DEFAULT_ADMIN_CREDS = {
    email: "admin@admin.com",
    password: "admin@admin.com"
};
