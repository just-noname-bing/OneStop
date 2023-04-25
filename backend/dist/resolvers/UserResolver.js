"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const types_1 = require("../types");
const TokenService_1 = require("../utils/TokenService");
const constants_1 = require("../utils/constants");
const validateEmail_1 = __importDefault(require("../utils/validateEmail"));
const validateSchema_1 = __importDefault(require("../utils/validateSchema"));
const UserResolver = {
    Query: {
        async me(_parent, _args, ctx) {
            if (!ctx.auth)
                throw new Error("not authenticated");
            let user = null;
            try {
                const { userId } = (0, jsonwebtoken_1.verify)(ctx.auth.split(" ")[1], constants_1.accessToken_secret);
                user = await constants_1.prisma.user.findFirst({ where: { id: userId } });
            }
            catch (error) {
                throw new Error("not authenticated");
            }
            if (!user)
                throw new Error("not authenticated");
            return user;
        },
    },
    Mutation: {
        async login(_parent, { options }) {
            const { email, password } = options;
            const errors = await (0, validateSchema_1.default)(types_1.LoginInputSchema, options);
            if (errors.length)
                return { errors };
            const user = await constants_1.prisma.user.findFirst({ where: { email } });
            if (!user || !(await (0, bcrypt_1.compare)(password, user.password))) {
                return {
                    errors: [
                        { field: "email", message: "incorrect credentials" },
                        { field: "password", message: "incorrect credentials" },
                    ],
                };
            }
            if (!user.verified)
                return { errors: [{ field: "email", message: "Verify email" }] };
            return {
                data: {
                    accessToken: (0, TokenService_1.generateAccessToken)({
                        userId: user.id,
                        role: user.role,
                        verified: user.verified,
                    }),
                    refreshToken: await (0, TokenService_1.generateRefreshToken)({
                        userId: user.id,
                        role: user.role,
                        verified: user.verified,
                    }),
                },
            };
        },
        async register(_paren, { options }) {
            const { email, name, password, surname } = options;
            const errors = await (0, validateSchema_1.default)(types_1.RegisterInputSchema, options);
            if (errors.length)
                return { errors };
            try {
                const { id } = await constants_1.prisma.user.create({
                    data: {
                        email,
                        name,
                        surname,
                        password: await (0, bcrypt_1.hash)(password, constants_1.pswSaltRounds),
                    },
                });
                await (0, validateEmail_1.default)(email, id);
                return { errors: [{ field: "email", message: "Verification email sent" }] };
            }
            catch (error) {
                if (error.code === "P2002") {
                    return { errors: [{ field: "email", message: "Already exists" }] };
                }
                console.log(error);
                return { errors: [{ field: "email", message: "Something went wrong" }] };
            }
        },
        async verifyConformationToken(_parent, args) {
            const { token } = args;
            if (!token)
                return false;
            try {
                const { userId } = (0, jsonwebtoken_1.verify)(token, constants_1.emailVerificationToken_secret);
                await constants_1.prisma.user.update({
                    data: {
                        verified: true,
                    },
                    where: {
                        id: userId,
                    },
                });
                return true;
            }
            catch (error) {
                return false;
            }
        },
    },
};
exports.default = UserResolver;
//# sourceMappingURL=UserResolver.js.map