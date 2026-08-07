import express from "express";
import { signUpload } from "../controllers/uploadController.js";
import { authenticateUser, isManager, authorizedSectors } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/sign", authenticateUser, isManager, authorizedSectors("Suporte & Operações"), signUpload);

export default router;
