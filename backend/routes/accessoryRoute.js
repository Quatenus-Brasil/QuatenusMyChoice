import express from "express";
import { createAccessory, findAllAccessories, findAccessoryById, deleteAccessory, editAccessory, deleteAccessoryImage } from "../controllers/accessoryController.js";
import { authenticateUser, isAdmin, isManager, authorizedSectors } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";
import { createUploader } from "../middlewares/uploadMiddleware.js";

const router = express.Router();
const upload = createUploader("accessories");
const uploadFields = upload.fields([{ name: "banner", maxCount: 1 }]);

router.post("/", authenticateUser, isManager, authorizedSectors("Suporte & Operações"), uploadFields, createAccessory);
router.get("/", authenticateUser, findAllAccessories);
router.get("/:id", authenticateUser, validId, findAccessoryById);
router.delete("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), deleteAccessory);
router.put("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), uploadFields, editAccessory);
router.delete("/:id/image", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), deleteAccessoryImage);

export default router;
