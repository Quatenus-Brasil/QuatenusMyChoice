import express from "express";
import { createDevice, findAllDevices, findDeviceById, deleteDevice, editDevice, deleteDeviceImage } from "../controllers/deviceController.js";
import { authenticateUser, isAdmin, isManager, authorizedSectors } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";
import { createUploader } from "../middlewares/uploadMiddleware.js";

const router = express.Router();
const upload = createUploader("devices");
const uploadFields = upload.fields([{ name: "banner", maxCount: 1 }]);

router.post("/", authenticateUser, isManager, authorizedSectors("Suporte & Operações"), uploadFields, createDevice);
router.get("/", authenticateUser, findAllDevices);
router.get("/:id", authenticateUser, validId, findDeviceById);
router.delete("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), deleteDevice);
router.put("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), uploadFields, editDevice);
router.delete("/:id/image", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), deleteDeviceImage);

export default router;
