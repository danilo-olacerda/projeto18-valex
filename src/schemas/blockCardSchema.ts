import Joi from "joi";

export const blockCardSchema = Joi.object({
    cardId: Joi.number().integer().required(),
    password: Joi.string().length(4).required()
});