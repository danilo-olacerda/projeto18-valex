import { Request, Response, NextFunction } from 'express';
import { activateCardSchema } from '../schemas/activateCardSchema';
import bcrypt from 'bcrypt';

export function validateActivation(req: Request, res: Response, next: NextFunction) {

    const { error } = activateCardSchema.validate(req.body);

    if (error){
        return res.status(400).send(error);
    }

    const { cardId, CVC, password}: {cardId: string, CVC: string, password: string} = req.body;

    res.locals.cardId = cardId;
    res.locals.CVC = CVC;
    res.locals.password = password;
    
    next();

}

