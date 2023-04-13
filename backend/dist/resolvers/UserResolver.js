"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = require("bcrypt");
const __1 = require("..");
const types_1 = require("../types");
const validateSchema_1 = __importDefault(require("../utils/validateSchema"));
const UserResolver = {
    Query: {
        async userInfo() {
            return await __1.prisma.user.findMany();
        },
    },
    Mutation: {
        async login(_, { options }) {
            const { email, password } = options;
            const errors = await (0, validateSchema_1.default)(types_1.LoginInputSchema, options);
            if (errors.length) {
                return { errors };
            }
            const user = await __1.prisma.user.findFirst({ where: { email } });
            if (!user) {
                return {
                    errors: [
                        { field: "email", message: "Incorrect credentials" },
                        { field: "password", message: "Incorrect credentials" },
                    ],
                };
            }
            if (!(await (0, bcrypt_1.compare)(password, user.password))) {
                return {
                    errors: [
                        { field: "email", message: "Incorrect credentials" },
                        { field: "password", message: "Incorrect credentials" },
                    ],
                };
            }
            return {
                data: user,
            };
        },
        async register(_, { options }) {
            const { email, name, password, surname } = options;
            const errors = await (0, validateSchema_1.default)(types_1.RegisterInputSchema, options);
            if (errors.length) {
                return { errors };
            }
            try {
                const user = await __1.prisma.user.create({
                    data: {
                        email,
                        name,
                        password: await (0, bcrypt_1.hash)(password, 10),
                        surname,
                    },
                });
                return { data: user };
            }
            catch (error) {
                if (error.code === "P2002") {
                    return {
                        errors: [{ field: "email", message: "Already exists" }],
                    };
                }
                console.log(error);
                return { errors: [{ field: "email", message: "Something went wrong" }] };
            }
        },
    },
};
exports.default = UserResolver;
//# sourceMappingURL=UserResolver.js.map