import { Router } from "express";
import { newCardService } from "../services/cardServices";
import { validateNewCard } from "../middlewares/validateNewCard";
import { insertNewCard, activateCard, getBalance, blockCard, unBlockCard, chargeCard, buyWithCard } from "../controllers/cardController";
import { validateActivation } from "../middlewares/validateActivation";
import { validateGetBalance } from "../middlewares/validateGetBalance";
import { validateCardToBlock } from "../middlewares/validateCardToBlock";
import { validateCompanyToken } from "../middlewares/validateCompanyToken";
import { validateBuy } from "../middlewares/validateBuy";

const router = Router();

router.post("/create-card", validateNewCard, newCardService, insertNewCard);
router.post("/activate-card", validateActivation, activateCard);
router.get("/card-balance", validateGetBalance, getBalance);
router.post("/block-card", validateCardToBlock, blockCard);
router.post("/unblock-card", validateCardToBlock, unBlockCard);
router.post("/card-recharge", validateCompanyToken, chargeCard);
router.post("/card-payment", validateBuy, buyWithCard);

export default router;