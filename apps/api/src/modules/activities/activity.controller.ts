import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCodes } from "../../common/errors/errorCodes.js";
import * as activityService from "./activity.service.js";
import {
  cityIdParamSchema,
  listActivitiesQuerySchema,
} from "./activity.validation.js";

export const listCityActivities = asyncHandler(async (req, res) => {
  const cityParsed = cityIdParamSchema.safeParse(req.params);
  if (!cityParsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid city id",
      cityParsed.error.flatten()
    );
  }

  const queryParsed = listActivitiesQuerySchema.safeParse(req.query);
  if (!queryParsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid query parameters",
      queryParsed.error.flatten()
    );
  }

  const activities = await activityService.listCityActivities(
    cityParsed.data.cityId,
    queryParsed.data
  );
  res.status(200).json({ success: true, data: activities });
});