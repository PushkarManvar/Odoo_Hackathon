import { Router } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import {
  createItem,
  deleteItem,
  reorderItems,
  updateItem,
} from "./itinerary.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/stops/:stopId/items", createItem);
router.patch("/items/:itemId", updateItem);
router.delete("/items/:itemId", deleteItem);
router.patch("/stops/:stopId/items/reorder", reorderItems);

export default router;