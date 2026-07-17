import express from "express";
import {
  createAccessoryInstallationCategory,
  findAllAccessoryInstallationCategories,
  findAccessoryInstallationCategoryById,
  deleteAccessoryInstallationCategory,
  editAccessoryInstallationCategory,
} from "../controllers/accessoryInstallationCategoryController.js";
import { authenticateUser, isAdmin, isManager, authorizedSectors } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, isManager, authorizedSectors("Suporte & Operações"), createAccessoryInstallationCategory);
router.get("/", authenticateUser, findAllAccessoryInstallationCategories);
router.get("/:id", authenticateUser, validId, findAccessoryInstallationCategoryById);
router.delete("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), deleteAccessoryInstallationCategory);
router.patch("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), editAccessoryInstallationCategory);

export default router;
