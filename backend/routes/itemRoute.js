import express from "express";
import { findAllItems, createItem, findItemById, deleteItem } from "../controllers/itemController.js";
import { authenticateUser, isAdmin } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, createItem)
router.get("/", authenticateUser, findAllItems);
router.get("/:id", authenticateUser, validId, findItemById);
router.delete("/:id", authenticateUser, validId, deleteItem);

export default router;
