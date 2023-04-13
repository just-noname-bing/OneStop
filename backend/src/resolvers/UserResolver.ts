import { User } from "@prisma/client";
import { compare, hash } from "bcrypt";
import { prisma } from "..";
import {
	LoginInput,
	LoginInputSchema,
	RegisterInput,
	RegisterInputSchema,
	UserResponse,
} from "../types";
import ValidateSchema from "../utils/validateSchema";

const UserResolver = {
	Query: {
		async userInfo(): Promise<User[]> {
			// validte accessToken n stuf
			// return user
			return await prisma.user.findMany();
		},
	},
	Mutation: {
		async login(_: any, { options }: LoginInput): Promise<UserResponse> {
			const { email, password } = options;

			const errors = await ValidateSchema(LoginInputSchema, options);

			if (errors.length) {
				return { errors };
			}

			const user = await prisma.user.findFirst({ where: { email } });

			if (!user) {
				return {
					errors: [
						{ field: "email", message: "Incorrect credentials" },
						{ field: "password", message: "Incorrect credentials" },
					],
				};
			}

			if (!(await compare(password, user.password))) {
				return {
					errors: [
						{ field: "email", message: "Incorrect credentials" },
						{ field: "password", message: "Incorrect credentials" },
					],
				};
			}

			// return accessToken
			return {
				data: user,
			};
		},
		async register(_: any, { options }: RegisterInput): Promise<UserResponse> {
			// get input
			const { email, name, password, surname } = options;

			// validate fields
			// ...

			const errors = await ValidateSchema(RegisterInputSchema, options);

			if (errors.length) {
				return { errors };
			}

			try {
				const user = await prisma.user.create({
					data: {
						email,
						name,
						password: await hash(password, 10), // encrypt password
						surname,
					},
				});

				// create accessToken

				return { data: user }; // accessToken
			} catch (error) {
				if (error.code === "P2002") {
					return {
						errors: [{ field: "email", message: "Already exists" }],
					};
				}
				console.log(error);
				return { errors: [{ field: "email", message: "Something went wrong" }] };
			}
		},
		// async logout(): Promise<boolean> {},
	},
};

export default UserResolver;
