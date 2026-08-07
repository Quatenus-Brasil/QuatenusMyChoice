import express from "express";
import { createDevice, findAllDevices, findDeviceById, deleteDevice, editDevice } from "../controllers/deviceController.js";
import { authenticateUser, isAdmin, isManager, authorizedSectors } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { createDeviceSchema, editDeviceSchema } from "../schemas/deviceSchema.js";

const router = express.Router();

router.post("/", authenticateUser, isManager, authorizedSectors("Suporte & Operações"), validate(createDeviceSchema), createDevice);
router.get("/", authenticateUser, findAllDevices);
router.get("/:id", authenticateUser, validId, findDeviceById);
router.delete("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), deleteDevice);
router.patch("/:id", authenticateUser, validId, isManager, authorizedSectors("Suporte & Operações"), validate(editDeviceSchema), editDevice);

export default router;
