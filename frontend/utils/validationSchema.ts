import { object, string } from "yup";

export const PASSWORD_INPUT_SCHEMA = object({
    password: string().required().max(20).min(5),
})

export const LOGIN_INPUT_SCHEMA = object({
    email: string().email().required().max(50),
}).concat(PASSWORD_INPUT_SCHEMA);

const user_info_fields = object({
    name: string().trim().required().max(50),
    surname: string().trim().required().max(50),
})

export const REGISTER_INPUT_SCHEMA = object({})
    .concat(LOGIN_INPUT_SCHEMA)
    .concat(user_info_fields);
