import express from "express";
import multer from 'multer';
import { findAll, findById, deleteFamily, downloadFamilies, uploadFamilies } from "../controllers/familyController.js";
import { authenticateUser, isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: 'uploads/families' });

router.get("/", authenticateUser, findAll);
router.get("/download", authenticateUser, isAdmin, downloadFamilies);
router.get("/:id", authenticateUser, findById);
router.post('/upload', authenticateUser, isAdmin, upload.single('file'), uploadFamilies);
router.delete("/:id", authenticateUser, isAdmin, deleteFamily);

export default router;
