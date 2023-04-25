import { compare, hash } from "bcrypt";
import { verify } from "jsonwebtoken";
import {
	CustomContext,
	EmailTokenInput,
	LoginInput,
	LoginInputSchema,
	RegisterInput,
	RegisterInputSchema,
	UserResponse,
} from "../types";
import { TokenPayload, generateAccessToken, generateRefreshToken } from "../utils/TokenService";
import {
	accessToken_secret,
	emailVerificationToken_secret,
	prisma,
	pswSaltRounds,
} from "../utils/constants";
import ValidateEmail, { EmailTokenPayload } from "../utils/validateEmail";
import ValidateSchema from "../utils/validateSchema";

const UserResolver = {
	Query: {
		async me(_parent: any, _args: any, ctx: CustomContext) {
			// access token -> bearer token
			if (!ctx.auth) throw new Error("not authenticated");

			let user = null;
			try {
				const { userId } = verify(
					ctx.auth.split(" ")[1],
					accessToken_secret
				) as TokenPayload;

				user = await prisma.user.findFirst({ where: { id: userId } });
			} catch (error) {
				throw new Error("not authenticated");
			}

			if (!user) throw new Error("not authenticated");

			// if (!user.verified) throw new Error("verify email");

			return user;
		},
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
	},
};

export default UserResolver;
