import cors from "cors";
import express from "express";
import { errorMiddleware } from "./middleware/error.middleware.js";
import activityRoutes from "./modules/activities/activity.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import budgetRoutes from "./modules/budget/budget.routes.js";
import cityRoutes from "./modules/cities/city.routes.js";
import itineraryRoutes from "./modules/itinerary/itinerary.routes.js";
import sharingRoutes from "./modules/sharing/sharing.routes.js";
import stopRoutes from "./modules/stops/stop.routes.js";
import tripRoutes from "./modules/trips/trip.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ success: true, data: { status: "ok" } });
});

app.use("/api/auth", authRoutes);
app.use("/api/trips", tripRoutes);
app.use("/api/cities", cityRoutes);
app.use("/api/cities", activityRoutes);
app.use("/api", sharingRoutes);
app.use("/api", budgetRoutes);
app.use("/api", itineraryRoutes);
app.use("/api", stopRoutes);

// feature routes registered here

app.use(errorMiddleware);

export default app;