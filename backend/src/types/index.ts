import { Roles, User } from "@prisma/client";
import { InferType, boolean, mixed, object, string } from "yup";

export {};

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            DATABASE_URL: string;
            EXPO_URL: string;
            DOMAIN: string;
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
export const PASSWORD_INPUT_SCHEMA = object({
    password: string().required().max(20).min(5),
});

export const LOGIN_INPUT_SCHEMA = object({
    email: string().email().required().max(50),
}).concat(PASSWORD_INPUT_SCHEMA);

const user_info_fields = object({
    name: string().trim().required().max(50),
    surname: string().trim().required().max(50),
});

export interface LoginInput {
    options: InferType<typeof LOGIN_INPUT_SCHEMA>;
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

export const REGISTER_INPUT_SCHEMA = object({})
    .concat(LOGIN_INPUT_SCHEMA)
    .concat(user_info_fields);

export interface RegisterInput {
    options: InferType<typeof REGISTER_INPUT_SCHEMA>;
}

export const UPDATE_USER_INPUT_SCHEMA = object({
    verified: boolean().required(),
    role: mixed<Roles>().oneOf(["DEFAULT", "MODERATOR"]).required(),
})
    .concat(user_info_fields)
    .concat(LOGIN_INPUT_SCHEMA.omit(["password"]));

export interface UpdateUserInput {
    id: string;
    options: InferType<typeof UPDATE_USER_INPUT_SCHEMA>;
}

export interface SearchUserInput {
    options: {
        // name: string
        // surname: string
        // email: string
        search_text_field: string;
        verified: boolean;
        role: Roles;
        created_at: Date;
    };
}

// post and comments

export interface MessageResponse<T> {
    data?: T;
    errors?: FieldError[];
}

export const POST_INPUT_SCHEMA = object({
    text: string().trim().required().max(200),
    title: string().trim().required().max(100),
    transport_id: string().required(),
});

export interface PostInput {
    options: InferType<typeof POST_INPUT_SCHEMA>;
}

export const UPDATE_POST_INPUT_SCHEMA = object({
    id: string().required().uuid(),
}).concat(POST_INPUT_SCHEMA);

export const UPDATE_COMMENT_INPUT_SCHEMA = object({
    id: string().required().uuid(),
    text: string().trim().required().max(200), // new text
});

// new update Post args
// id:String!
// text:String!
// title:String!
// transport_id:String!

export interface UpdatePostInput {
    options: InferType<typeof UPDATE_POST_INPUT_SCHEMA>;
}

export interface UpdateCommentInput {
    options: InferType<typeof UPDATE_COMMENT_INPUT_SCHEMA>;
}

// export interface withInputSchema<t:ObjectSchema> {
//     options: InferType<t>;
// }

export const COMMENT_INPUT_SCHEMA = object({
    postId: string().required().uuid(),
    text: string().trim().required().max(200),
});

export interface CommentInput {
    options: InferType<typeof COMMENT_INPUT_SCHEMA>;
}

// input PostInputSearch {
//     # title:String
//     # text:String
//     search_text_field:String
//     transport_id:String
//     created_at:DateTime
// }
export interface SearchPostInput {
    options: {
        search_text_field: string;
        transport_id: string;
        created_at: Date;
    };
}
