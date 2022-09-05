import { Request, Response, NextFunction } from 'express';
import { onlineBuySchema } from '../schemas/onlineBuySchema';

export async function validateOnlineBuy(req: Request, res: Response, next: NextFunction) {

    const { error } = onlineBuySchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    const { cardNumber, cardHolder, expirationDate, securityCode, amount, businessId }: {expirationDate: string, securityCode: string ,cardHolder: string, cardNumber: string, password: string, businessId: number, amount: number} = req.body;

    res.locals.cardNumber = cardNumber;
    res.locals.cardHolder = cardHolder;
    res.locals.expirationDate = expirationDate;
    res.locals.securityCode = securityCode;
    res.locals.amount = amount;
    res.locals.businessId = businessId;

    next();

}

