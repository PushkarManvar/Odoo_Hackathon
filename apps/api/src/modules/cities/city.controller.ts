import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCodes } from "../../common/errors/errorCodes.js";
import * as cityService from "./city.service.js";
import { cityIdParamSchema, listCitiesQuerySchema } from "./city.validation.js";

export const listCities = asyncHandler(async (req, res) => {
  const parsed = listCitiesQuerySchema.safeParse(req.query);
  if (!parsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid query parameters",
      parsed.error.flatten()
    );
  }

  const cities = await cityService.listCities(parsed.data);
  res.status(200).json({ success: true, data: cities });
});

export const getCity = asyncHandler(async (req, res) => {
  const parsed = cityIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid city id",
      parsed.error.flatten()
    );
  }

  const city = await cityService.getCity(parsed.data.cityId);
  res.status(200).json({ success: true, data: city });
});