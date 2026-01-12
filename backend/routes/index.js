import { Router } from "express";
import itemRoute from "./itemRoute.js";
import userRoute from "./userRoute.js";
import gamaRoute from "./gamaRoute.js";
import accessoryRoute from "./accessoryRoute.js";
import chipRoute from "./chipRoute.js";

const router = Router();

router.use("/item", itemRoute);
router.use("/user", userRoute);
router.use("/gama", gamaRoute);
router.use("/accessory", accessoryRoute);
router.use("/chip", chipRoute);

export default router;
