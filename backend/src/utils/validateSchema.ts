import { ObjectSchema } from "yup";
import { FieldError } from "../types";

const ValidateSchema = async (schema: ObjectSchema<any>, value: object): Promise<FieldError[]> => {
	try {
		await schema.validate(value, { abortEarly: false });
	} catch (error) {
		// console.log(error);
		const errors: FieldError[] = [];
		error.inner.forEach((er: any) => {
			errors.push({
				field: er.path,
				message: er.message,
			});
		});

		return errors;
	}

	return [];
};

export default ValidateSchema;
