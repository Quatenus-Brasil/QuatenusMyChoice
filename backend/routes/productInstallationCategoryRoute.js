import express from "express";
import {
  createProductInstallationCategory,
  findAllProductInstallationCategories,
  findProductInstallationCategoryById,
  deleteProductInstallationCategory,
  editProductInstallationCategory,
} from "../controllers/productInstallationCategoryController.js";
import { authenticateUser, isAdmin, isManager, authorizedSectors } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { createProductInstallationCategorySchema, editProductInstallationCategorySchema } from "../schemas/productInstallationCategorySchema.js";
const router = express.Router();

router.post(
  "/",
  authenticateUser,
  isManager,
  authorizedSectors("Suporte & Operações"),
  validate(createProductInstallationCategorySchema),
  createProductInstallationCategory,
);
router.get("/", authenticateUser, findAllProductInstallationCategories);
router.get("/:id", authenticateUser, validId, findProductInstallationCategoryById);
router.delete("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), deleteProductInstallationCategory);
router.patch(
  "/:id",
  authenticateUser,
  validId,
  isManager,
  authorizedSectors("Suporte & Operações"),
  validate(editProductInstallationCategorySchema),
  editProductInstallationCategory,
);

export default router;
