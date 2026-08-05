import express from "express";
import { createItem, findAllItems, findItemById, deleteItem, editItem } from "../controllers/itemController.js";
import { authenticateUser, isAdmin } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { createItemSchema, editItemSchema } from "../schemas/itemSchema.js";
import { validId } from "../middlewares/globalMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, validate(createItemSchema), createItem);
router.get("/", authenticateUser, findAllItems);
router.get("/:id", authenticateUser, validId, findItemById);
router.delete("/:id", authenticateUser, validId, deleteItem);
router.patch("/:id", authenticateUser, validId, validate(editItemSchema), editItem);

export default router;
