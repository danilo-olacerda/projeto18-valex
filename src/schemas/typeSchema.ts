import Joi from "joi";

export const typeSchema = Joi.object({
    employeId: Joi.number().integer().required(),
    type: Joi.string().valid("groceries", "restaurant", "transport", "education", "health").required()
});