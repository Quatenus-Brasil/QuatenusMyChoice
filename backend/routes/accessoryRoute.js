import express from "express";
import multer from 'multer';
import { findAll, uploadAccessories } from "../controllers/accessoryController.js";
import { authenticateUser, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/accessories' });

router.get("/", authenticateUser, findAll);
router.post('/upload', authenticateUser, isAdmin, upload.single('file'), uploadAccessories);

export default router;
