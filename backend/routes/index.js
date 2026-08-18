import { Router } from "express";
import userRoute from "./userRoute.js";
import itemRoute from "./itemRoute.js";
import chipRoute from "./chipRoute.js";
import deviceRoute from "./deviceRoute.js";
import accessoryRoute from "./accessoryRoute.js";
import uploadRoute from "./uploadRoute.js";

const router = Router();

router.use("/user", userRoute);
router.use("/upload", uploadRoute);
router.use("/item", itemRoute);
router.use("/chip", chipRoute);
router.use("/device", deviceRoute);
router.use("/accessory", accessoryRoute);

export default router;
