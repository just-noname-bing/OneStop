"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const jsonwebtoken_1 = require("jsonwebtoken");
const types_1 = require("../types");
const TokenService_1 = require("../utils/TokenService");
const constants_1 = require("../utils/constants");
const EmailService_1 = require("../utils/EmailService");
const validateSchema_1 = __importDefault(require("../utils/validateSchema"));
const isAuth_1 = __importDefault(require("../utils/isAuth"));
const isAuth_2 = __importDefault(require("../utils/isAuth"));
const UserResolver = {
    Query: {
        me: (0, isAuth_2.default)((_p, _args, ctx) => {
            return ctx.user;
        }, []),
        getUsers: (0, isAuth_2.default)(async (_p, _args, _ctx) => {
            return await constants_1.prisma.user.findMany();
        }, ["ADMIN", "MODERATOR"])
    },
    Mutation: {
        async login(_parent, { options }) {
            const { email, password } = options;
            const errors = await (0, validateSchema_1.default)(types_1.LOGIN_INPUT_SCHEMA, options);
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
            const errors = await (0, validateSchema_1.default)(types_1.REGISTER_INPUT_SCHEMA, options);
            if (errors.length)
                return { errors };
            try {
                const { id } = await constants_1.prisma.user.create({
                    data: {
                        email,
                        name,
                        surname,
                        password: await (0, bcrypt_1.hash)(password, constants_1.PASSWORD_SALT_ROUNDS),
                    },
                });
                await (0, EmailService_1.sendEmailToken)(email, id);
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
        async logout(_p, args, _ctx) {
            const { token } = args;
            if (!token)
                throw new Error("token is required");
            try {
                const { userId } = (0, jsonwebtoken_1.verify)(token, constants_1.REFRESH_TOKEN_SECRET);
                const userTokens = await constants_1.prisma.refreshTokens.findUnique({ where: { userId } });
                if (!userTokens || !userTokens.token.includes(token))
                    return false;
                await constants_1.prisma.refreshTokens.update({
                    where: { userId },
                    data: {
                        token: {
                            set: userTokens.token.filter(x => x !== token)
                        }
                    }
                });
                return true;
            }
            catch (err) {
                return false;
            }
        },
        deleteUser: (0, isAuth_1.default)(async (_p, args, ctx) => {
            const { id } = args;
            if (!id) {
                throw new Error("id is required");
            }
            const userToDelete = await constants_1.prisma.user.findFirst({ where: { id } });
            if (!userToDelete)
                return false;
            if (ctx.user.role === "DEFAULT" && ctx.user.id === id) {
            }
            else if (ctx.user.role === "MODERATOR" &&
                (ctx.user.id === id || userToDelete.role === "DEFAULT")) {
            }
            else if (ctx.user.role === "ADMIN" && userToDelete.role !== "ADMIN"
                && ctx.user.id !== id) {
            }
            else
                return false;
            await constants_1.prisma.user.delete({ where: { id } });
            return true;
        }, []),
        updateUser: (0, isAuth_2.default)(async (_p, { options, id }, ctx) => {
            if (!id) {
                throw new Error("id is required");
            }
            const errors = await (0, validateSchema_1.default)(types_1.UPDATE_USER_INPUT_SCHEMA, options);
            if (errors.length) {
                return { errors };
            }
            const userToUpdate = await constants_1.prisma.user.findFirst({ where: { id } });
            if (!userToUpdate) {
                throw new Error("user not found");
            }
            if (ctx.user.role === "DEFAULT" && ctx.user.id === id) {
            }
            else if (ctx.user.role === "MODERATOR" &&
                (ctx.user.id === id || userToUpdate.role === "DEFAULT")) {
            }
            else if (ctx.user.role === "ADMIN" && userToUpdate.role !== "ADMIN"
                && ctx.user.id !== id) {
            }
            else {
                throw new Error("not authorized");
            }
            const updateFields = (_a) => {
                var { verified, email, role } = _a, defaultFields = __rest(_a, ["verified", "email", "role"]);
                return ctx.user.id === id ? (defaultFields) :
                    (ctx.user.role !== "ADMIN" ? Object.assign({ verified, email }, defaultFields) : (options));
            };
            try {
                const updatedUser = await constants_1.prisma.user.update({
                    where: { id },
                    data: updateFields(options)
                });
                return { data: updatedUser };
            }
            catch (err) {
                if (err.code === "P2002") {
                    return { errors: [{ field: "email", message: "Already in use" }] };
                }
                return { errors: [] };
            }
        }, []),
        forgotPassword: async (_p, args, _ctx) => {
            const { email } = args;
            if (!email)
                return false;
            const user = await constants_1.prisma.user.findFirst({ where: { email } });
            if (!user)
                return false;
            await (0, EmailService_1.sendResetPasswordToken)(email, user.id);
            return true;
        },
        userSearch: (0, isAuth_2.default)(async (_p, { options }, _ctx) => {
            const { search_text_field, role, verified, created_at } = options;
            return await constants_1.prisma.user.findMany({
                where: {
                    AND: [
                        {
                            OR: [
                                { email: { contains: search_text_field } },
                                { surname: { contains: search_text_field } },
                                { name: { contains: search_text_field } },
                            ]
                        },
                        { created_at: { lte: created_at } },
                        { role },
                        { verified },
                    ],
                }
            });
        }, ["ADMIN", "MODERATOR"])
    },
};
exports.default = UserResolver;
//# sourceMappingURL=UserResolver.js.map