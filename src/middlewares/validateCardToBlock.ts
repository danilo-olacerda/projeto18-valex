import { Request, Response, NextFunction } from 'express';
import { blockCardSchema } from '../schemas/blockCardSchema';

export function validateCardToBlock(req: Request, res: Response, next: NextFunction) {

    const { error } = blockCardSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.message);
    }

    res.locals.cardId = req.body.cardId;
    res.locals.password = req.body.password;

    next();

}