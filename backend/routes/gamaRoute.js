import express from "express";
import { createGama, findAllGamas, findGamaById, deleteGama, editGama } from "../controllers/gamaController.js";
import { authenticateUser, isAdmin, isManager } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, isManager, createGama)
router.get("/", authenticateUser, findAllGamas);
router.get("/:id", authenticateUser, validId, findGamaById);
router.delete("/:id", authenticateUser, isManager, validId, deleteGama);
router.put("/:id", authenticateUser, isManager, validId, editGama);

export default router;
