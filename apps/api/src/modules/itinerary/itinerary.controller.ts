import { asyncHandler } from "../../common/utils/asyncHandler.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCodes } from "../../common/errors/errorCodes.js";
import * as itineraryService from "./itinerary.service.js";
import {
  createItemSchema,
  itemIdParamSchema,
  reorderItemsSchema,
  stopIdParamSchema,
  updateItemSchema,
} from "./itinerary.validation.js";

export const createItem = asyncHandler(async (req, res) => {
  const stopParsed = stopIdParamSchema.safeParse(req.params);
  if (!stopParsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid stop id",
      stopParsed.error.flatten()
    );
  }

  const bodyParsed = createItemSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid input",
      bodyParsed.error.flatten()
    );
  }

  const item = await itineraryService.createItem(
    req.user!.id,
    stopParsed.data.stopId,
    bodyParsed.data
  );
  res.status(201).json({ success: true, data: item });
});

export const updateItem = asyncHandler(async (req, res) => {
  const paramParsed = itemIdParamSchema.safeParse(req.params);
  if (!paramParsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid item id",
      paramParsed.error.flatten()
    );
  }

  const bodyParsed = updateItemSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid input",
      bodyParsed.error.flatten()
    );
  }

  const item = await itineraryService.updateItem(
    req.user!.id,
    paramParsed.data.itemId,
    bodyParsed.data
  );
  res.status(200).json({ success: true, data: item });
});

export const deleteItem = asyncHandler(async (req, res) => {
  const paramParsed = itemIdParamSchema.safeParse(req.params);
  if (!paramParsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid item id",
      paramParsed.error.flatten()
    );
  }

  await itineraryService.deleteItem(req.user!.id, paramParsed.data.itemId);
  res.status(204).send();
});

export const reorderItems = asyncHandler(async (req, res) => {
  const stopParsed = stopIdParamSchema.safeParse(req.params);
  if (!stopParsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid stop id",
      stopParsed.error.flatten()
    );
  }

  const bodyParsed = reorderItemsSchema.safeParse(req.body);
  if (!bodyParsed.success) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "Invalid input",
      bodyParsed.error.flatten()
    );
  }

  const result = await itineraryService.reorderItems(
    req.user!.id,
    stopParsed.data.stopId,
    bodyParsed.data
  );
  res.status(200).json({ success: true, data: result });
});