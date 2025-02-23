import express from "express";
import { login, register, logout, token, auth } from "../controllers/auth";

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.post("/token", token);
router.get("/", auth);

export default router;
