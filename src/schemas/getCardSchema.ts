import Joi from "joi";

export const getCardSchema = Joi.object({
    cardId: Joi.number().integer().required()
});