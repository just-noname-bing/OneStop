"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
                        password,
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
                return { errors: [{ field: "email", message: "Something went wrong" }] };
            }
        },
    },
};
exports.default = UserResolver;
//# sourceMappingURL=UserResolver.js.map