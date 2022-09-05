import Joi from "joi";

export const newBuySchema = Joi.object({
    cardId: Joi.number().integer().required(),
    amount: Joi.number().required().greater(0),
    password: Joi.string().length(4).required(),
    businessId: Joi.number().integer().required()
});