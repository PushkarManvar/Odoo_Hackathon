import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCodes } from "../../common/errors/errorCodes.js";
import * as stopService from "./stop.service.js";
import {
  createStopSchema,
  reorderStopsSchema,
  updateStopSchema,
} from "./stop.validation.js";

export const createStop = asyncHandler(async (req, res) => {
  const parsed = createStopSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid input",
      parsed.error.flatten()
    );
  }

  const stop = await stopService.createStop(
    req.user!.id,
    req.params.tripId,
    parsed.data
  );
  res.status(201).json({ success: true, data: stop });
});

export const updateStop = asyncHandler(async (req, res) => {
  const parsed = updateStopSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid input",
      parsed.error.flatten()
    );
  }

  const stop = await stopService.updateStop(
    req.user!.id,
    req.params.stopId,
    parsed.data
  );
  res.status(200).json({ success: true, data: stop });
});

export const deleteStop = asyncHandler(async (req, res) => {
  await stopService.deleteStop(req.user!.id, req.params.stopId);
  res.status(204).end();
});

export const reorderStops = asyncHandler(async (req, res) => {
  const parsed = reorderStopsSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid input",
      parsed.error.flatten()
    );
  }

  const stops = await stopService.reorderStops(
    req.user!.id,
    req.params.tripId,
    parsed.data
  );
  res.status(200).json({ success: true, data: stops });
});