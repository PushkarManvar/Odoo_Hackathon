import { Router } from "express";
import { getCity, listCities } from "./city.controller.js";

const router = Router();

router.get("/", listCities);
router.get("/:cityId", getCity);

export default router;