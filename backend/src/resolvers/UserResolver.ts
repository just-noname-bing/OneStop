import { compare, hash } from "bcrypt";
import { verify } from "jsonwebtoken";
import {
    CustomContext,
    EmailTokenInput,
    LoginInput,
    LoginInputSchema,
    RegisterInput,
    RegisterInputSchema,
    UpdateUserInput,
    UpdateUserInputSchema,
    UpdateUserResponse,
    UserResponse,
} from "../types";
import { TokenPayload, generateAccessToken, generateRefreshToken } from "../utils/TokenService";
import {
    emailVerificationToken_secret,
    prisma,
    pswSaltRounds,
    refreshToken_secret,
} from "../utils/constants";
import ValidateEmail, { EmailTokenPayload } from "../utils/validateEmail";
import ValidateSchema from "../utils/validateSchema";
import IsAuth from "../utils/isAuth";
import isAuth from "../utils/isAuth";

const UserResolver = {
    Query: {
        me: isAuth((_p: any, _args: any, ctx: CustomContext) => {
            return ctx.user;
        }, []),
        getUsers: isAuth(async (_p: any, _args: any, _ctx: CustomContext) => {
            return await prisma.user.findMany();
        }, ["ADMIN", "MODERATOR"])
    },

    Mutation: {
        async login(_parent: any, { options }: LoginInput): Promise<UserResponse> {
            const { email, password } = options;

            const errors = await ValidateSchema(LoginInputSchema, options);
            if (errors.length) return { errors };

            const user = await prisma.user.findFirst({ where: { email } });

            if (!user || !(await compare(password, user.password))) {
                return {
                    errors: [
                        { field: "email", message: "incorrect credentials" },
                        { field: "password", message: "incorrect credentials" },
                    ],
                };
            }

            // if user exists and password is valid
            // generate access token
            // and refresh token

            // if email is not verified
            // send error

            if (!user.verified) return { errors: [{ field: "email", message: "Verify email" }] };

            return {
                data: {
                    accessToken: generateAccessToken({
                        userId: user.id,
                        role: user.role,
                        verified: user.verified,
                    }),
                    refreshToken: await generateRefreshToken({
                        userId: user.id,
                        role: user.role,
                        verified: user.verified,
                    }),
                },
            };
        },
        async register(_paren: any, { options }: RegisterInput): Promise<UserResponse> {
            const { email, name, password, surname } = options;
            const errors = await ValidateSchema(RegisterInputSchema, options);

            if (errors.length) return { errors };

            try {
                const { id } = await prisma.user.create({
                    data: {
                        email,
                        name,
                        surname,
                        password: await hash(password, pswSaltRounds),
                    },
                });

                // account created
                // send verification token to clients email
                await ValidateEmail(email, id);

                //
                return { errors: [{ field: "email", message: "Verification email sent" }] };

                // create access token and refresh token
                // return {
                // 	data: {
                // 		accessToken: generateAccessToken({ userId: id, role, verified }),
                // 		refreshToken: await generateRefreshToken({ userId: id, role, verified }),
                // 	},
                // };
            } catch (error) {
                if (error.code === "P2002") {
                    return { errors: [{ field: "email", message: "Already exists" }] };
                }
                console.log(error);
                return { errors: [{ field: "email", message: "Something went wrong" }] };
            }
        },

        async verifyConformationToken(_parent: any, args: EmailTokenInput): Promise<boolean> {
            const { token } = args;
            // to add more security layers we can verify access token too

            if (!token) return false;

            try {
                const { userId } = verify(
                    token,
                    emailVerificationToken_secret
                ) as EmailTokenPayload;

                // change verified in database
                // if no user
                // this will throw an error
                await prisma.user.update({
                    data: {
                        verified: true,
                    },
                    where: {
                        id: userId,
                    },
                });

                return true;

                // improve security

                // account verified
                // client have to use login resolver to get tokens and log in

                // return {
                // 	data: {
                // 		accessToken: generateAccessToken({ userId, role, verified }),
                // 		refreshToken: await generateRefreshToken({ userId, role, verified }),
                // 	},
                // };
            } catch (error) {
                // if (error.code === "TokenExpiredError") {
                // 	return ;
                // }
                return false;
            }
        },

        async logout(_p: any, args: any, _ctx: any): Promise<boolean> {
            const { token } = args as { token: string }

            if (!token) throw new Error("token is required")

            try {
                const { userId } = verify(token, refreshToken_secret) as TokenPayload

                const userTokens = await prisma.refreshTokens.findUnique({ where: { userId } })

                if (!userTokens || !userTokens.token.includes(token)) return false

                //invalidate old refresh token
                await prisma.refreshTokens.update({
                    where: { userId },
                    data: {
                        token: {
                            set: userTokens.token.filter(x => x !== token)
                        }
                    }
                })

                return true
            } catch (err) {
                //bad token
                return false
            }
        },

        // user update and delete
        deleteUser: IsAuth(
            async (_p: any, args: any, ctx: CustomContext): Promise<boolean> => {
                const { id } = args as { id: string }

                if (!id) {
                    throw new Error("id is required")
                }

                const userToDelete = await prisma.user.findFirst({ where: { id } })

                // user doesnt exist
                if (!userToDelete) return false


                if (ctx.user.role === "DEFAULT" && ctx.user.id === id) {
                    // default can delete only himself
                } else if (ctx.user.role === "MODERATOR" &&
                    (ctx.user.id === id || userToDelete.role === "DEFAULT")) {
                    // moderator can delete only himself and any default user
                } else if (ctx.user.role === "ADMIN" && userToDelete.role !== "ADMIN"
                    && ctx.user.id !== id) {
                    // admin can only delete moderators and default users
                } else return false


                // delete user
                await prisma.user.delete({ where: { id } })

                return true

            }, []),

        updateUser: isAuth(async (_p: any, { options, id }: UpdateUserInput, ctx: CustomContext): Promise<UpdateUserResponse> => {
            if (!id) {
                throw new Error("id is required")
            }

            const errors = await ValidateSchema(UpdateUserInputSchema, options)

            if (errors.length) {
                return { errors }
            }

            const userToUpdate = await prisma.user.findFirst({ where: { id } })

            if (!userToUpdate) {
                throw new Error("user not found")
            }

            if (ctx.user.role === "DEFAULT" && ctx.user.id === id) {
                // default -> only himself
            } else if (ctx.user.role === "MODERATOR" &&
                (ctx.user.id === id || userToUpdate.role === "DEFAULT")) {
                // mod ->  himself, any [default] 
            } else if (ctx.user.role === "ADMIN" && userToUpdate.role !== "ADMIN"
                && ctx.user.id !== id) {
                // admin -> any [default, mod] 
            } else {
                throw new Error("not authorized")
            }

            const updateFields = ({ verified, email, role, ...defaultFields }: typeof options) => {
                if (ctx.user.role !== "ADMIN") delete options.role
                return ctx.user.id === id ? (defaultFields) : (options)
            }

            const updatedUser = await prisma.user.update({
                where: { id },
                data: updateFields(options)
            })

            return { data: updatedUser }

        }, [])
    },
};

export default UserResolver;
