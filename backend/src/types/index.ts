import type { User } from "@prisma/client";
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

export enum Roles {
	DEFAULT,
	MODERATOR,
	ADMIN,
}
export interface ServerContext {
	userData: {
		userId: string;
		role: Roles;
	};
}

// graphql types

export const LoginInputSchema = object({
	email: string().email().required(),
	password: string().required(),
});

export interface LoginInput {
	options: InferType<typeof LoginInputSchema>;
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
