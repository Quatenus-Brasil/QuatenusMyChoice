import express from "express";
import { createGama, findAllGamas, findGamaById, deleteGama, editGama } from "../controllers/gamaController.js";
import { authenticateUser, isAdmin } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { createGamaSchema, editGamaSchema } from "../schemas/gamaSchema.js";

const router = express.Router();

router.post("/", authenticateUser, validate(createGamaSchema), createGama);
router.get("/", authenticateUser, findAllGamas);
router.get("/:id", authenticateUser, validId, findGamaById);
router.delete("/:id", authenticateUser, validId, deleteGama);
router.patch("/:id", authenticateUser, validId, validate(editGamaSchema), editGama);

export default router;
