import { Roles, User } from "@prisma/client";
import { InferType, boolean, mixed, object, string } from "yup";

export { };

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
    // user?: Omit<User, "password">;
    user: Omit<User, "password">;
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

const UserInfoFields = object({
    name: string().trim().required(),
    surname: string().trim().required(),
})

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

export interface UpdateUserResponse {
    data?: User;
    errors?: FieldError[];
}

export const RegisterInputSchema = object({}).concat(LoginInputSchema).concat(UserInfoFields);

export interface RegisterInput {
    options: InferType<typeof RegisterInputSchema>;
}

export const UpdateUserInputSchema = object({
    verified: boolean().required(),
    role: mixed<Roles>().oneOf(["DEFAULT", "MODERATOR"])
}).concat(UserInfoFields).concat(LoginInputSchema.omit(["password"]));

export interface UpdateUserInput {
    id: string
    options: InferType<typeof UpdateUserInputSchema>;
}

// post and comments

export interface MessageResponse<T> {
    data?: T;
    errors?: FieldError[];
}

export const PostInputSchema = object({
    text: string().trim().required().max(200),
});

export interface PostInput {
    options: InferType<typeof PostInputSchema>;
}

export const updatePostCommentInputSchema = object({
    id: string().required().uuid(),
    text: string().trim().required().max(200), // new text
});

export interface updatePostCommentInput {
    options: InferType<typeof updatePostCommentInputSchema>;
}

// export interface withInputSchema<t:ObjectSchema> {
//     options: InferType<t>;
// }


export const CommentInputSchema = object({
    postId: string().required().uuid(),
    text: string().trim().required().max(200),
});

export interface CommentInput {
    options: InferType<typeof CommentInputSchema>;
}

