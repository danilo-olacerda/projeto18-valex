import { Request, Response } from 'express';
import { insert as insertCard, update as cardUpdate } from '../repositories/cardRepository';
import { activateCardService, getCardBalance, blockCardService, unBlockCardService } from '../services/cardServices';

export async function insertNewCard(req: Request, res: Response) {

    const { card } = res.locals;
    
    try {

        await insertCard(card);

        res.status(201).send("Card created");
    } catch (error) {

        res.status(500).send("Internal server error");

    } 
}

export async function activateCard(req: Request, res: Response) {

    try {

        const { cardId, password }: {cardId: number, password: string} = await activateCardService(req, res);

        await cardUpdate(cardId, { password });

        res.status(200).send("Card activated");

    } catch (error) {

        res.status(500).send("Internal server error");


    } 

}

export async function getBalance(req: Request, res: Response) {

    try {

        await getCardBalance(req, res)

    } catch (error) {

        return res.status(500).send("Internal server error");

    } 

}

export async function blockCard(req: Request, res: Response) {

    try {

        await blockCardService(req, res);

    } catch (error) {

        res.status(500).send("Internal server error");

    } 

}

export async function unBlockCard(req: Request, res: Response) {

    try {

        await unBlockCardService(req, res);

    } catch (error) {

        res.status(500).send("Internal server error");

    } 

}