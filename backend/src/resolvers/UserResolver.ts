import { User } from "@prisma/client";
import { prisma } from "..";
import { FieldError, RegisterInput, RegisterInputSchema, UserResponse } from "../types";
import ValidateSchema from "../utils/validateSchema";

const UserResolver = {
	Query: {
		async userInfo(): Promise<User[]> {
			return await prisma.user.findMany();
		},
	},
	Mutation: {
		// async login(): Promise<UserResponse> {},
		async register(_: any, { options }: RegisterInput): Promise<UserResponse> {
			// get input
			const { email, name, password, surname } = options;

			// validate fields
			// ...

			const errors: FieldError[] = await ValidateSchema(RegisterInputSchema, options);

			if (errors.length) {
				return { errors };
			}

			try {
				const user = await prisma.user.create({
					data: {
						email,
						name,
						password, // encrypt password
						surname,
					},
				});

				return { data: user };
			} catch (error) {
				if (error.code === "P2002") {
					return {
						errors: [{ field: "email", message: "Already exists" }],
					};
				}
				return { errors: [{ field: "email", message: "Something went wrong" }] };
			}
		},
		// async logout(): Promise<boolean> {},
	},
};

export default UserResolver;
