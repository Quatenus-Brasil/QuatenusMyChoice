import express from "express";
import { createUser, login, findAllUsers, inactivateUser, findUserById, editUser, changePassword } from "../controllers/userController.js";
import { authenticateUser, isAdmin, isManager } from "../middlewares/authMiddleware.js";
import { validate } from "../middlewares/validationMiddleware.js";
import { createUserSchema, editUserSchema, changePasswordSchema } from "../schemas/userSchema.js";
import { validId } from "../middlewares/globalMiddleware.js";

const router = express.Router();

router.post("/create", authenticateUser, isAdmin, validate(createUserSchema), createUser);
router.post("/login", login);
router.get("/", authenticateUser, isManager, findAllUsers);
router.patch("/inactivate/:id", authenticateUser, isAdmin, validId, inactivateUser);
router.get("/:id", authenticateUser, validId, findUserById);
router.patch("/edit/:id", authenticateUser, isAdmin, validId, validate(editUserSchema), editUser);
router.patch("/change-password", authenticateUser, validate(changePasswordSchema), changePassword);

export default router;
