import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCodes } from "../../common/errors/errorCodes.js";
import * as budgetService from "./budget.service.js";

export const getBudget = asyncHandler(async (req, res) => {
  const tripId = req.params.tripId;
  if (!tripId) {
    throw new AppError(400, ErrorCodes.VALIDATION_ERROR, "Invalid trip id");
  }

  const budget = await budgetService.getBudget(req.user!.id, tripId);
  res.status(200).json({ success: true, data: budget });
});