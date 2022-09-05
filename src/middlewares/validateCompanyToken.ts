import { Request, Response, NextFunction } from 'express';
import { balanceCardSchema } from '../schemas/balanceCardSchema';
import { findByApiKey } from '../repositories/companyRepository';

export async function validateCompanyToken(req: Request, res: Response, next: NextFunction) {

    const { error } = balanceCardSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ error: error.message });
    }

    const { cardId }: {cardId: number} = req.body;
    const { "x-api-key": companyKey } = req.headers;

    if (!companyKey) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const company = await findByApiKey(companyKey as string);

    if (!company) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    res.locals.cardId = cardId;
    res.locals.amount = req.body.amount;
    res.locals.company = company;

    next();

}

