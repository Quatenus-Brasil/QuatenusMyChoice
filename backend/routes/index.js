import { Router } from "express";
import familyRoute from "./familyRoute.js";
import accessoryRoute from "./accessoryRoute.js"
import userRoute from "./userRoute.js";
import roleRoute from "./roleRoute.js";
import bomRoute from "./bomRoute.js";
import faqRoute from "./faqRoute.js";

const router = Router();

router.use("/families", familyRoute);
router.use("/accessories", accessoryRoute);
router.use("/user", userRoute);
router.use("/role", roleRoute);
router.use("/bom", bomRoute);
router.use("/faq", faqRoute)

export default router;
