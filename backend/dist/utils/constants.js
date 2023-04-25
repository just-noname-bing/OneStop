"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pswSaltRounds = exports.emailVerificationToken_secret = exports.refreshToken_secret = exports.accessToken_secret = exports.server_port = exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient();
exports.server_port = process.env.PORT;
exports.accessToken_secret = "bombobmbombombombobmobmaaab";
exports.refreshToken_secret = "wwawawwwweweewweaweweawe";
exports.emailVerificationToken_secret = "ssbaisoysdbisdobybsdye3095";
exports.pswSaltRounds = 10;
//# sourceMappingURL=constants.js.map