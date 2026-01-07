import express from "express";
import { createGama, findAllGamas, findGamaById, deleteGama } from "../controllers/gamaController.js";
import { authenticateUser, isAdmin } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, createGama)
router.get("/", authenticateUser, findAllGamas);
router.get("/:id", authenticateUser, validId, findGamaById);
router.delete("/:id", authenticateUser, validId, deleteGama);

export default router;
