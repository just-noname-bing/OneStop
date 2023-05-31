"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validateSchema = async (schema, value) => {
    try {
        await schema.validate(value, { abortEarly: false });
    }
    catch (error) {
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
exports.default = validateSchema;
//# sourceMappingURL=validateSchema.js.map