import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { getBudget } from "./budget.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/trips/:tripId/budget", getBudget);

export default router;