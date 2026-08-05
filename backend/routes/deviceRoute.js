import express from "express";
import { createDevice, findAllDevices, findDeviceById, deleteDevice, editDevice } from "../controllers/deviceController.js";
import { authenticateUser, isAdmin } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";

const router = express.Router();

router.post("/", authenticateUser, createDevice);
router.get("/", authenticateUser, findAllDevices);
router.get("/:id", authenticateUser, validId, findDeviceById);
router.delete("/:id", authenticateUser, validId, deleteDevice);
router.patch("/:id", authenticateUser, validId, editDevice);

export default router;
