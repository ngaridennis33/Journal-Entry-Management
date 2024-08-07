import express from "express";
import { validate } from "../middleware/validate";
import { categorySchema, createJournalSchema, updateJournalSchema } from "../schema/journal.schema";
import { createJournalHandler, deleteJournalHandler, getAllJournalsHandler, getJournalByCategoryHandler, getSpecificJournalsHandler, updateJournalHandler } from "../controllers/journal.controllers";
import { deserializeUser } from "../middleware/deserializeUser";
import { requireUser } from "../middleware/require";

const router = express.Router();
router.use(deserializeUser,requireUser);

router.post('/', validate(createJournalSchema), createJournalHandler);
router.get('/', getAllJournalsHandler);
router.get('/:id', getSpecificJournalsHandler);
router.put('/:id',validate(updateJournalSchema), updateJournalHandler);
router.get('/category/:category',validate(categorySchema), getJournalByCategoryHandler);
router.delete('/delete/:id', deleteJournalHandler);

export default router;