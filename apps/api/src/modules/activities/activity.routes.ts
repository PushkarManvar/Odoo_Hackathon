import { Router } from "express";
import { listCityActivities } from "./activity.controller.js";

const router = Router();

router.get("/:cityId/activities", listCityActivities);

export default router;