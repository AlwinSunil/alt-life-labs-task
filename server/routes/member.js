import express from "express";
import {
  getMembers,
  getMember,
  createMember,
  updateMember,
  deleteMember,
} from "../controllers/member.js";
import { adminMiddleware } from "../middleware/adminCheck.js";

const router = express.Router();

router.use(adminMiddleware);

router.get("/", getMembers);
router.get("/:id", getMember);
router.post("/", createMember);
router.put("/:id", updateMember);
router.delete("/:id", deleteMember);

export default router;
