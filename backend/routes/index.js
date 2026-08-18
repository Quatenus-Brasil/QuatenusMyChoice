import { Router } from "express";
import userRoute from "./userRoute.js";
import itemRoute from "./itemRoute.js";
import gamaRoute from "./gamaRoute.js";
import chipRoute from "./chipRoute.js";
import deviceRoute from "./deviceRoute.js";
import accessoryRoute from "./accessoryRoute.js";
import productInstallationCategoryRoute from "./productInstallationCategoryRoute.js";
import uploadRoute from "./uploadRoute.js";

const router = Router();

router.use("/user", userRoute);
router.use("/upload", uploadRoute);
router.use("/item", itemRoute);
router.use("/gama", gamaRoute);
router.use("/chip", chipRoute);
router.use("/device", deviceRoute);
router.use("/accessory", accessoryRoute);
router.use("/product-installation-category", productInstallationCategoryRoute);

export default router;
