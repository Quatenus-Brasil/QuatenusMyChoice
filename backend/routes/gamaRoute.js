import express from "express";
import { createGama, findAllGamas, findGamaById, deleteGama, editGama } from "../controllers/gamaController.js";
import { authenticateUser, isAdmin, isManager, authorizedSectors } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, isManager, authorizedSectors("Suporte & Operações"), createGama);
router.get("/", authenticateUser, findAllGamas);
router.get("/:id", authenticateUser, validId, findGamaById);
router.delete("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), deleteGama);
router.patch("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), editGama);

export default router;
