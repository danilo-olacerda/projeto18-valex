import Joi from "joi";

export const balanceCardSchema = Joi.object({
    cardId: Joi.number().integer().required(),
    amount: Joi.number().required().greater(0)
});