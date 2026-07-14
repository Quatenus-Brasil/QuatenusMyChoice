import { Router } from "express";
import userRoute from "./userRoute.js";
import itemRoute from "./itemRoute.js";
import accessoryInstallationCategoryRoute from "./accessoryInstallationCategoryRoute.js";
import gamaRoute from "./gamaRoute.js";
import chipRoute from "./chipRoute.js";
import deviceRoute from "./deviceRoute.js";
import accessoryRoute from "./accessoryRoute.js";

const router = Router();

router.use("/user", userRoute);
router.use("/item", itemRoute);
router.use("/accessory-installation-category", accessoryInstallationCategoryRoute);
router.use("/gama", gamaRoute);
router.use("/chip", chipRoute);
router.use("/device", deviceRoute);
router.use("/accessory", accessoryRoute);

export default router;
