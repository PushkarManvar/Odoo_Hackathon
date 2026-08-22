import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { login, me, signup } from "./auth.controller.js";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authMiddleware, me);

export default router;