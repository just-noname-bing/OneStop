"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ValidateSchema = async (schema, value) => {
    try {
        await schema.validate(value, { abortEarly: false });
    }
    catch (error) {
        console.log(error);
        const errors = [];
        error.inner.forEach((er) => {
            errors.push({
                field: er.path,
                message: er.message,
            });
        });
        return errors;
    }
    return [];
};
exports.default = ValidateSchema;
//# sourceMappingURL=validateSchema.js.map