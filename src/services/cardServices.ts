import { Request, Response, NextFunction } from "express";
import { findByApiKey } from "../repositories/companyRepository";
import { findById } from "../repositories/employeeRepository";
import { findById as findCardById, update as cardUpdate } from "../repositories/cardRepository";
import { findByCardId as findRecharges } from "../repositories/rechargeRepository";
import { findByCardId as findPayments } from "../repositories/paymentRepository";
import { faker } from '@faker-js/faker';
import dayjs from "dayjs";
import Cryptr from "cryptr";
import bcrypt from 'bcrypt';
import { findByTypeAndEmployeeId, TransactionTypes, CardInsertData } from "../repositories/cardRepository";

export async function newCardService(req: Request, res: Response, next: NextFunction) {

    const { "x-api-key": companieKey } = req.headers;
    const { employeId, type }: {employeId: number, type: TransactionTypes } = req.body;

    const companie = await findByApiKey(companieKey as string);

    if (!companie) {
        return res.status(401).send("Unauthorized");
    }

    const employe = await findById(employeId);

    if (!employe || employe.companyId !== companie.id) {
        return res.status(404).send("Employee not found");
    }

    const cardExists = await findByTypeAndEmployeeId(type, employeId);

    if (cardExists) {
        return res.status(409).send("Card type already exists to this employe");
    }

    const cryptr = new Cryptr("salt");

    let cardCVV = faker.finance.creditCardCVV();

    cardCVV = cryptr.encrypt(cardCVV);

    const newCard: CardInsertData = {
        employeeId: employeId,
        number: faker.finance.creditCardNumber(),
        cardholderName: prepareCardName(employe.fullName),
        securityCode: cardCVV,
        expirationDate: dayjs().add(5, "year").format("MM/YYYY"),
        isVirtual: false,
        isBlocked: false,
        type
    };

    res.locals.card = newCard;

    next();
}

function prepareCardName(cardName: string) {

    const nameArray = cardName.split(" ");
    let finalName = "";

    finalName += nameArray[0].toUpperCase() + " ";

    for (let i = 1; i <= nameArray.length - 2; i++) {
        if (nameArray[i].length > 2) {
            console.log(nameArray[i]);
            finalName += nameArray[i][0].toUpperCase() + " ";
        }
    }

    finalName += nameArray[nameArray.length - 1].toUpperCase();

    return finalName;

}

export async function activateCardService(req: Request, res: Response): Promise<any> {

    let { cardId, CVC, password } = res.locals;

    try {

        const card = await findCardById(cardId);
        
        if (dayjs().format("MM/YYYY") > dayjs(card.expirationDate).format("MM/YYYY")) {
            return res.status(401).send("Card expired");
        }

        if (card.password){
            return res.status(409).send("Card already activated");
        }

        const cryptr = new Cryptr("salt");
        const decryptedCVC = cryptr.decrypt(card.securityCode);

        if (decryptedCVC !== CVC) {
            return res.status(401).send("Invalid CVC");
        }

        password = await bcrypt.hash(password, 10);

        return { cardId, password };

    } catch (error) {

        return res.status(500).send("Internal server error");

    } 

}

export async function getCardBalance(req: Request, res: Response): Promise<any> {

    const { cardId } = res.locals;

    try {

        const card = await findCardById(cardId);

        if (!card) {
            return res.status(404).send("Card not found");
        }

        if (!card.password){
            return res.status(401).send("Card not activated");
        }

        const recharges = await findRecharges(cardId);
        const payments = await findPayments(cardId);

        let balance = 0;

        recharges.forEach(recharge => {recharge.amount ? balance += recharge.amount : 0});
        payments.forEach(payment => {payment.amount ? balance -= payment.amount : 0});

        return res.status(200).send({
            balance,
            transactions: payments,
            recharges
        });

    } catch (error) {

        return res.status(500).send("Internal server error");

    } 

}

export async function blockCardService(req: Request, res: Response){

    try {

        const { cardId, password } = res.locals;

        const card = await findCardById(cardId);

        if (!card) {
            return res.status(404).send("Card not found");
        }

        if (!card.password){
            return res.status(401).send("Card not activated");
        }

        if (card.isBlocked){
            return res.status(409).send("Card already blocked");
        }

        const isPasswordCorrect = await bcrypt.compare(password, card.password);

        if (!isPasswordCorrect) {
            return res.status(401).send("Invalid password");
        }

        await cardUpdate(cardId, {isBlocked: true});

        return res.status(200).send("Card blocked");

    } catch (error) {

        return "Internal server error";

    } 
}

export async function unBlockCardService(req: Request, res: Response){

    try {

        const { cardId, password } = res.locals;

        const card = await findCardById(cardId);

        if (!card) {
            return res.status(404).send("Card not found");
        }

        if (!card.password){
            return res.status(401).send("Card not activated");
        }

        if (dayjs().format("MM/YYYY") > dayjs(card.expirationDate).format("MM/YYYY")){
            return res.status(401).send("Card expired");
        }

        if (!card.isBlocked){
            return res.status(409).send("Card already unblocked");
        }

        const isPasswordCorrect = await bcrypt.compare(password, card.password);

        if (!isPasswordCorrect) {
            return res.status(401).send("Invalid password");
        }

        await cardUpdate(cardId, {isBlocked: false});

        return res.status(200).send("Card unblocked");

    } catch (error) {

        return res.status(500).send("Internal server error");

    }
}