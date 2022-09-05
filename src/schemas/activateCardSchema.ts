import Joi from "joi";

export const activateCardSchema = Joi.object({
    cardId: Joi.number().integer().required(),
    CVC: Joi.string().required(),
    password: Joi.string().length(4).required(),
});