import express from "express";
import { register, createUser, login, deleteUser } from "../controllers/userController.js";
import { authenticateUser, isAdmin, isManager } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/create", authenticateUser, isAdmin, createUser);
router.post("/login", login);
router.delete("/delete/:id", authenticateUser, isAdmin, validId, deleteUser);

export default router;
