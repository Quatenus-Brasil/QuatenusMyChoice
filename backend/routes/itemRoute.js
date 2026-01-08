import express from "express";
import { createItem, findAllItems, findItemById, deleteItem, editItem } from "../controllers/itemController.js";
import { authenticateUser, isAdmin, isManager, authorizedSectors } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, isManager, authorizedSectors("Suporte & Operações"), createItem);
router.get("/", authenticateUser, findAllItems);
router.get("/:id", authenticateUser, validId, findItemById);
router.delete("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), deleteItem);
router.put("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), editItem);
export default router;
