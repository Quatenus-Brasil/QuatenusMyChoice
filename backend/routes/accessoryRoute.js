import express from "express";
import { createAccessory, findAllAccessories, findAccessoryById, deleteAccessory, editAccessory } from "../controllers/accessoryController.js";
import { authenticateUser, isAdmin, isManager, authorizedSectors } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { createAccessorySchema, editAccessorySchema } from "../schemas/accessorySchema.js";

const router = express.Router();

router.post("/", authenticateUser, isManager, authorizedSectors("Suporte & Operações"), validate(createAccessorySchema), createAccessory);
router.get("/", authenticateUser, findAllAccessories);
router.get("/:id", authenticateUser, validId, findAccessoryById);
router.delete("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), deleteAccessory);
router.patch("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), validate(editAccessorySchema), editAccessory);

export default router;
