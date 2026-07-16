import express from "express";
import { register, createUser, login, findAllUsers, inactivateUser, findUserById, editUser, changePassword } from "../controllers/userController.js";
import { authenticateUser, isAdmin, isManager } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { createUserSchema, editUserSchema, changePasswordSchema } from "../schemas/userSchema.js";
import { validId } from "../middlewares/globalMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/create", authenticateUser, isAdmin, validate(createUserSchema), createUser);
router.post("/login", login);
router.get("/", authenticateUser, isManager, findAllUsers);
// router.delete("/delete/:id", authenticateUser, isAdmin, validId, deleteUser);
router.patch("/inactivate/:id", authenticateUser, isManager, validId, inactivateUser);
router.get("/:id", authenticateUser, validId, findUserById);
router.put("/edit", authenticateUser, isManager, validate(editUserSchema), editUser);
router.patch("/changePassword", authenticateUser, validate(changePasswordSchema), changePassword);

export default router;
