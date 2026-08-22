import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCodes } from "../../common/errors/errorCodes.js";
import * as sharingService from "./sharing.service.js";
import {
  publicSlugParamSchema,
  tripIdParamSchema,
} from "./sharing.validation.js";

export const publishTrip = asyncHandler(async (req, res) => {
  const parsed = tripIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid trip id",
      parsed.error.flatten()
    );
  }

  const result = await sharingService.publishTrip(
    req.user!.id,
    parsed.data.tripId
  );
  res.status(200).json({ success: true, data: result });
});

export const unpublishTrip = asyncHandler(async (req, res) => {
  const parsed = tripIdParamSchema.safeParse(req.params);
  if (!parsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid trip id",
      parsed.error.flatten()
    );
  }

  const result = await sharingService.unpublishTrip(
    req.user!.id,
    parsed.data.tripId
  );
  res.status(200).json({ success: true, data: result });
});

export const getPublicTrip = asyncHandler(async (req, res) => {
  const parsed = publicSlugParamSchema.safeParse(req.params);
  if (!parsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid slug",
      parsed.error.flatten()
    );
  }

  const trip = await sharingService.getPublicTrip(parsed.data.slug);
  res.status(200).json({ success: true, data: trip });
});

export const copyTrip = asyncHandler(async (req, res) => {
  const parsed = publicSlugParamSchema.safeParse(req.params);
  if (!parsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid slug",
      parsed.error.flatten()
    );
  }

  const result = await sharingService.copyTrip(req.user!.id, parsed.data.slug);
  res.status(201).json({ success: true, data: result });
});