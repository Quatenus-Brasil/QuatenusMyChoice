import express from "express";
import { createChip, findAllChips, findChipById, deleteChip, editChip } from "../controllers/chipController.js";
import { authenticateUser, isAdmin, isManager, authorizedSectors } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { createChipSchema, editChipSchema } from "../schemas/chipSchema.js";

const router = express.Router();

router.post("/", authenticateUser, isManager, authorizedSectors("Suporte & Operações"), validate(createChipSchema), createChip);
router.get("/", authenticateUser, findAllChips);
router.get("/:id", authenticateUser, validId, findChipById);
router.delete("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), deleteChip);
router.patch("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), validate(editChipSchema), editChip);

export default router;
