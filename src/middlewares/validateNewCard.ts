import { Request, Response, NextFunction } from 'express';
import { typeSchema } from '../schemas/typeSchema';

export function validateNewCard(req: Request, res: Response, next: NextFunction) {

    const { employeId, type }: {employeId: string, type: string} = req.body;
    const { "x-api-key": companieKey } = req.headers;

    if (!companieKey){
        return res.status(400).send("Missing companie key");
    }

    if (!employeId || !type) {
        return res.status(400).send("Missing employe ID or type");
    }

    const { error } = typeSchema.validate(req.body);

    if (error) {
        return res.status(400).send(error.message );
    }

    next();

}

