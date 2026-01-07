import express from "express";
import { findAllItems, createItem } from "../controllers/itemController.js";
import { authenticateUser, isAdmin } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, createItem)
router.get("/", authenticateUser, findAllItems);

export default router;
