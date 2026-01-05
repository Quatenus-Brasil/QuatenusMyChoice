import express from "express";
import { findAllItems } from "../controllers/itemController.js";

const router = express.Router();

router.get("/", findAllItems);

export default router;
