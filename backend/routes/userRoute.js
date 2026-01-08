import express from "express";
import { register, createUser, login, findAllUsers, deleteUser, findUserById, editUser, changePassword } from "../controllers/userController.js";
import { authenticateUser, isAdmin, isManager } from "../middlewares/authMiddleware.js";
import { validId } from "../middlewares/globalMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/create", authenticateUser, isAdmin, createUser);
router.post("/login", login);
router.get("/", authenticateUser, isManager, findAllUsers);
router.delete("/delete/:id", authenticateUser, isAdmin, validId, deleteUser);
router.get("/:id", authenticateUser, validId, findUserById);
router.put("/edit", authenticateUser, isManager, editUser);
router.patch("/changePassword", authenticateUser, changePassword);

export default router;
