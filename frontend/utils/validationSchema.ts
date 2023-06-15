import { boolean, mixed, object, ref, string } from "yup";
import { Tokens } from "./context";

export const PASSWORD_INPUT_SCHEMA = object({
    password: string().required().max(20).min(5),
});

export const PASSWORD_CONFIRMATION_AND_RESET = object({
    password2: string().test(
        "passwords-match",
        "Passwords must match",
        function (value) {
            return this.parent.password === value;
        }
    ),
}).concat(PASSWORD_INPUT_SCHEMA)

export const PASSWORD_RESET_EMAIL = object({
    email: string().email().required().max(50),
});

export const LOGIN_INPUT_SCHEMA = object({
    email: string().email().required().max(50),
}).concat(PASSWORD_INPUT_SCHEMA);

const user_info_fields = object({
    name: string().trim().required().max(50),
    surname: string().trim().required().max(50),
});

export const REGISTER_INPUT_SCHEMA = object({})
    .concat(LOGIN_INPUT_SCHEMA)
    .concat(user_info_fields);

export interface FieldError {
    field: string;
    message: string;
}

export interface UserResponse {
    data?: Tokens;
    errors?: FieldError[];
}

export const Roles = {
    DEFAULT: "DEFAULT",
    MODERATOR: "MODERATOR",
    ADMIN: "ADMIN",
};

export type User = {
    id: string;
    name: string;
    role: Roles;
    surname: string;
    email: string;
    password: string;
    verified: boolean;
    created_at: Date;
    updated_at: Date;
};

export interface UpdateUserResponse {
    data?: User;
    errors?: FieldError[];
}

export type Roles = (typeof Roles)[keyof typeof Roles];

export const UPDATE_USER_INPUT_SCHEMA = object({
    verified: boolean().required(),
    role: mixed<Roles>().oneOf(["DEFAULT", "MODERATOR", "ADMIN"]).required(),
})
    .concat(user_info_fields)
    .concat(LOGIN_INPUT_SCHEMA.omit(["password"]));

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
    trip_id: string().required(),
    stop_id: string().required(),
    title: string().trim().required().max(100),
    transport_id: string().required(),
});


export const UPDATE_POST_INPUT_SCHEMA = object({
    id: string().required().uuid(),
}).concat(POST_INPUT_SCHEMA);

export const UPDATE_COMMENT_INPUT_SCHEMA = object({
    id: string().required().uuid(),
    text: string().trim().required().max(200), // new text
});

export const COMMENT_INPUT_SCHEMA = object({
    postId: string().required().uuid(),
    text: string().trim().required().max(200),
});

export interface SearchPostInput {
    options: {
        search_text_field: string;
        transport_id: string;
        created_at: Date;
    };
}
