import express from "express";
import { findAllImages } from "../controllers/imageController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateUser, findAllImages);

export default router;
