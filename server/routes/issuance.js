import express from "express";
import {
  getIssuances,
  getIssuance,
  createIssuance,
  updateIssuance,
  deleteIssuance,
  toggleIssuance,
} from "../controllers/issuance.js";
import { adminMiddleware } from "../middleware/adminCheck.js";

const router = express.Router();

router.use(adminMiddleware);

router.get("/", getIssuances);
router.get("/:id", getIssuance);
router.post("/", createIssuance);
router.put("/:id", updateIssuance);
router.delete("/:id", deleteIssuance);
router.patch("/:id/toggle", toggleIssuance);

export default router;
