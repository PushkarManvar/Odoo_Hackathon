import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  createTrip,
  deleteTrip,
  getTrip,
  listTrips,
  updateTrip,
} from "./trip.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/", listTrips);
router.post("/", createTrip);
router.get("/:tripId", getTrip);
router.patch("/:tripId", updateTrip);
router.delete("/:tripId", deleteTrip);

export default router;