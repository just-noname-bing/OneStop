"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegisterInputSchema = exports.LoginInputSchema = exports.Roles = void 0;
const yup_1 = require("yup");
var Roles;
(function (Roles) {
    Roles[Roles["DEFAULT"] = 0] = "DEFAULT";
    Roles[Roles["MODERATOR"] = 1] = "MODERATOR";
    Roles[Roles["ADMIN"] = 2] = "ADMIN";
})(Roles = exports.Roles || (exports.Roles = {}));
exports.LoginInputSchema = (0, yup_1.object)({
    email: (0, yup_1.string)().email().required(),
    password: (0, yup_1.string)().required(),
});
exports.RegisterInputSchema = (0, yup_1.object)({
    name: (0, yup_1.string)().trim().required(),
    surname: (0, yup_1.string)().trim().required(),
    email: (0, yup_1.string)().email().required(),
    password: (0, yup_1.string)().min(5).required(),
});
//# sourceMappingURL=index.js.map