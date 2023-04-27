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

// resolver context
// auth -> bearer token
export interface CustomContext {
	auth?: string;
}

// export enum Roles {
// 	DEFAULT,
// 	MODERATOR,
// 	ADMIN,
// }

// graphql types

export const LoginInputSchema = object({
	email: string().email().required().max(50),
	password: string().required().max(20),
});

export interface LoginInput {
	options: InferType<typeof LoginInputSchema>;
}

export interface EmailTokenInput {
	token: string;
}

export interface FieldError {
	field: string;
	message: string;
}

export interface Tokens {
	accessToken: string;
	refreshToken: string;
}

export interface UserResponse {
	data?: Tokens;
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
