import { Router } from "express";
import itemRoute from "./itemRoute.js";
import userRoute from "./userRoute.js";

const router = Router();

router.use("/item", itemRoute);
router.use("/user", userRoute);

export default router;
