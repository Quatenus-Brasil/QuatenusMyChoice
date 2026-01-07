import { Router } from "express";
import itemRoute from "./itemRoute.js";
import userRoute from "./userRoute.js";
import gamaRoute from "./gamaRoute.js";

const router = Router();

router.use("/item", itemRoute);
router.use("/user", userRoute);
router.use("/gama", gamaRoute);

export default router;
