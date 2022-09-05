import { Request, Response, NextFunction } from 'express';
import { getCardSchema } from '../schemas/getCardSchema';

export function validateGetBalance(req: Request, res: Response, next: NextFunction) {

    const { error } = getCardSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.message);
    }

    res.locals.cardId = req.body.cardId;

    next();

}