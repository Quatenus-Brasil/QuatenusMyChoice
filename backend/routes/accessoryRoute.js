import express from "express";
import { createAccessory, findAllAccessories, findAccessoryById, deleteAccessory, editAccessory, uploadAccessoryImage, deleteAccessoryImage } from "../controllers/accessoryController.js";
import { authenticateUser, isAdmin, isManager, authorizedSectors } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";
import { createUploader } from "../middlewares/uploadMiddleware.js";

const router = express.Router();
const upload = createUploader("accessories");

router.post("/", authenticateUser, isManager, authorizedSectors("Suporte & Operações"), createAccessory);
router.get("/", authenticateUser, findAllAccessories);
router.get("/:id", authenticateUser, validId, findAccessoryById);
router.delete("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), deleteAccessory);
router.put("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), editAccessory);
router.patch("/:id/image", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), upload.single("image"), uploadAccessoryImage);
router.delete("/:id/image", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), deleteAccessoryImage);

export default router;
