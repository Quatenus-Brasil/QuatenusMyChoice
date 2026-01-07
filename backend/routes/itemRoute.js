import express from "express";
import { createItem, findAllItems, findItemById, deleteItem } from "../controllers/itemController.js";
import { authenticateUser, isAdmin, isManager } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, isManager, createItem)
router.get("/", authenticateUser, findAllItems);
router.get("/:id", authenticateUser, validId, findItemById);
router.delete("/:id", authenticateUser, isManager, validId, deleteItem);

export default router;
