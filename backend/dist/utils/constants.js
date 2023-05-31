"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ADMIN_CREDS = exports.PASSWORD_SALT_ROUNDS = exports.EMAIL_VERIFICATION_TOKEN_SECRET = exports.REFRESH_TOKEN_SECRET = exports.ACCESS_TOKEN_SECRET = exports.SERVER_PORT = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
exports.SERVER_PORT = process.env.PORT;
exports.ACCESS_TOKEN_SECRET = "bombobmbombombombobmobmaaab";
exports.REFRESH_TOKEN_SECRET = "wwawawwwweweewweaweweawe";
exports.EMAIL_VERIFICATION_TOKEN_SECRET = "ssbaisoysdbisdobybsdye3095";
exports.PASSWORD_SALT_ROUNDS = 10;
exports.DEFAULT_ADMIN_CREDS = {
    email: "admin@admin.com",
    password: "admin@admin.com"
};
//# sourceMappingURL=constants.js.map