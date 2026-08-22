import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  copyTrip,
  getPublicTrip,
  publishTrip,
  unpublishTrip,
} from "./sharing.controller.js";

const router = Router();

router.get("/public/:slug", getPublicTrip);

router.post("/public/:slug/copy", authMiddleware, copyTrip);

router.post("/trips/:tripId/share", authMiddleware, publishTrip);
router.delete("/trips/:tripId/share", authMiddleware, unpublishTrip);

export default router;