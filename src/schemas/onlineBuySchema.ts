import Joi from "joi";

export const onlineBuySchema = Joi.object({
    cardNumber: Joi.string().length(19).required(),
    cardHolder: Joi.string().required(),
    expirationDate: Joi.string().length(7).required(),
    securityCode: Joi.string().length(3).required(),
    amount: Joi.number().required().greater(0),
    businessId: Joi.number().integer().required()
});