import express from "express";
import { createDevice, findAllDevices, findDeviceById, deleteDevice, editDevice } from "../controllers/deviceController.js";
import { authenticateUser, isAdmin, isManager, authorizedSectors } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, isManager, authorizedSectors("Suporte & Operações"), createDevice);
router.get("/", authenticateUser, findAllDevices);
router.get("/:id", authenticateUser, validId, findDeviceById);
router.delete("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), deleteDevice);
router.patch("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), editDevice);

export default router;
