import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCodes } from "../../common/errors/errorCodes.js";
import * as tripService from "./trip.service.js";
import { createTripSchema, updateTripSchema } from "./trip.validation.js";

export const listTrips = asyncHandler(async (req, res) => {
  const trips = await tripService.listTrips(req.user!.id);
  res.status(200).json({ success: true, data: trips });
});

export const getTrip = asyncHandler(async (req, res) => {
  const trip = await tripService.getTrip(req.user!.id, req.params.tripId);
  res.status(200).json({ success: true, data: trip });
});

export const createTrip = asyncHandler(async (req, res) => {
  const parsed = createTripSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid input",
      parsed.error.flatten()
    );
  }

  const trip = await tripService.createTrip(req.user!.id, parsed.data);
  res.status(201).json({ success: true, data: trip });
});

export const updateTrip = asyncHandler(async (req, res) => {
  const parsed = updateTripSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid input",
      parsed.error.flatten()
    );
  }

  const trip = await tripService.updateTrip(
    req.user!.id,
    req.params.tripId,
    parsed.data
  );
  res.status(200).json({ success: true, data: trip });
});

export const deleteTrip = asyncHandler(async (req, res) => {
  await tripService.deleteTrip(req.user!.id, req.params.tripId);
  res.status(204).end();
});