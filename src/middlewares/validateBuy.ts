import { Request, Response, NextFunction } from 'express';
import { newBuySchema } from '../schemas/newBuySchema';

export async function validateBuy(req: Request, res: Response, next: NextFunction) {

    const { error } = newBuySchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    const { cardId, password, businessId, amount }: {cardId: number, password: string, businessId: number, amount: number} = req.body;

    res.locals.cardId = cardId;
    res.locals.amount = amount;
    res.locals.businessId = businessId;
    res.locals.password = password;

    next();

}

