import { Router } from "express";
import userRoute from "./userRoute.js";
import itemRoute from "./itemRoute.js";
import chipRoute from "./chipRoute.js";
import deviceRoute from "./deviceRoute.js";
import accessoryRoute from "./accessoryRoute.js";
import familyBomRoute from "./familyBomRoute.js";
import uploadRoute from "./uploadRoute.js";

const router = Router();

router.use("/user", userRoute);
router.use("/upload", uploadRoute);
router.use("/item", itemRoute);
router.use("/chip", chipRoute);
router.use("/device", deviceRoute);
router.use("/accessory", accessoryRoute);
router.use("/family-bom", familyBomRoute);

export default router;
