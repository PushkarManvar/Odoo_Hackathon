import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  createStop,
  deleteStop,
  reorderStops,
  updateStop,
} from "./stop.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/trips/:tripId/stops", createStop);
router.patch("/trips/:tripId/stops/reorder", reorderStops);
router.patch("/stops/:stopId", updateStop);
router.delete("/stops/:stopId", deleteStop);

export default router;