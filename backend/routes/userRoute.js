import express from "express";
import { register, createUser } from "../controllers/userController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/create", createUser);

export default router;
