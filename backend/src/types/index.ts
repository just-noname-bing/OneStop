import { User } from "@prisma/client";
import { InferType, object, string } from "yup";

export {};

declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT: string;
			DATABASE_URL: string;
		}
	}
}

// graphql types

export interface LoginInput {
	email: string;
	password: string;
}

export interface FieldError {
	field: string;
	message: string;
}

export interface UserResponse {
	data?: Omit<User, "password">;
	errors?: FieldError[];
}

export const RegisterInputSchema = object({
	name: string().trim().required(),
	surname: string().trim().required(),
	email: string().email().required(),
	password: string().min(5).required(),
});

export interface RegisterInput {
	options: InferType<typeof RegisterInputSchema>;
}
