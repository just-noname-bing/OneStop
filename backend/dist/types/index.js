"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMMENT_INPUT_SCHEMA = exports.UPDATE_COMMENT_INPUT_SCHEMA = exports.UPDATE_POST_INPUT_SCHEMA = exports.POST_INPUT_SCHEMA = exports.UPDATE_USER_INPUT_SCHEMA = exports.REGISTER_INPUT_SCHEMA = exports.LOGIN_INPUT_SCHEMA = exports.PASSWORD_INPUT_SCHEMA = void 0;
const yup_1 = require("yup");
exports.PASSWORD_INPUT_SCHEMA = (0, yup_1.object)({
    password: (0, yup_1.string)().required().max(20).min(5),
});
exports.LOGIN_INPUT_SCHEMA = (0, yup_1.object)({
    email: (0, yup_1.string)().email().required().max(50),
}).concat(exports.PASSWORD_INPUT_SCHEMA);
const user_info_fields = (0, yup_1.object)({
    name: (0, yup_1.string)().trim().required().max(50),
    surname: (0, yup_1.string)().trim().required().max(50),
});
exports.REGISTER_INPUT_SCHEMA = (0, yup_1.object)({}).concat(exports.LOGIN_INPUT_SCHEMA).concat(user_info_fields);
exports.UPDATE_USER_INPUT_SCHEMA = (0, yup_1.object)({
    verified: (0, yup_1.boolean)().required(),
    role: (0, yup_1.mixed)().oneOf(["DEFAULT", "MODERATOR"]).required()
}).concat(user_info_fields).concat(exports.LOGIN_INPUT_SCHEMA.omit(["password"]));
exports.POST_INPUT_SCHEMA = (0, yup_1.object)({
    text: (0, yup_1.string)().trim().required().max(200),
    title: (0, yup_1.string)().trim().required().max(100),
    transport_id: (0, yup_1.string)().required(),
});
exports.UPDATE_POST_INPUT_SCHEMA = (0, yup_1.object)({
    id: (0, yup_1.string)().required().uuid(),
}).concat(exports.POST_INPUT_SCHEMA);
exports.UPDATE_COMMENT_INPUT_SCHEMA = (0, yup_1.object)({
    id: (0, yup_1.string)().required().uuid(),
    text: (0, yup_1.string)().trim().required().max(200),
});
exports.COMMENT_INPUT_SCHEMA = (0, yup_1.object)({
    postId: (0, yup_1.string)().required().uuid(),
    text: (0, yup_1.string)().trim().required().max(200),
});
//# sourceMappingURL=index.js.map