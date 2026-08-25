import express from "express";
import { createFamilyBom, findAllFamiliesBom, findFamilyBomById, deleteFamilyBom, editFamilyBom } from "../controllers/familyBomController.js";
import { authenticateUser, isAdmin, isManager, authorizedSectors } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { createFamilyBomSchema, editFamilyBomSchema } from "../schemas/familyBomSchema.js";

const router = express.Router();

router.post("/", authenticateUser, isManager, authorizedSectors("Suporte & Operações"), validate(createFamilyBomSchema), createFamilyBom);
router.get("/", authenticateUser, isManager, authorizedSectors("Suporte & Operações"), findAllFamiliesBom);
router.get("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), findFamilyBomById);
router.delete("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), deleteFamilyBom);
router.patch("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), validate(editFamilyBomSchema), editFamilyBom);

export default router;
