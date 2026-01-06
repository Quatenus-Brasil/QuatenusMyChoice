import express from "express";
import { register, createUser, login } from "../controllers/userController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/create", authenticateUser, createUser);
router.post("/login", login);

export default router;
