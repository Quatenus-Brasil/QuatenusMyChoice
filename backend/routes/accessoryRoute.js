import express from "express";
import { createAccessory, findAllAccessories, findAccessoryById, deleteAccessory, editAccessory } from "../controllers/accessoryController.js";
import { authenticateUser, isAdmin } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { createAccessorySchema, editAccessorySchema } from "../schemas/accessorySchema.js";

const router = express.Router();

router.post("/", authenticateUser, validate(createAccessorySchema), createAccessory);
router.get("/", authenticateUser, findAllAccessories);
router.get("/:id", authenticateUser, validId, findAccessoryById);
router.delete("/:id", authenticateUser, validId, deleteAccessory);
router.patch("/:id", authenticateUser, validId, validate(editAccessorySchema), editAccessory);

export default router;
