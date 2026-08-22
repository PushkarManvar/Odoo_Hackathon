import { prisma } from "../../config/prisma.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCodes } from "../../common/errors/errorCodes.js";
import {
  assertItemOwnership,
  assertStopOwnership,
} from "../../common/utils/ownership.js";
import type { ItineraryItemSummary } from "./itinerary.types.js";
import type {
  CreateItemInput,
  ReorderItemsInput,
  UpdateItemInput,
} from "./itinerary.validation.js";

const itemSelect = {
  id: true,
  tripStopId: true,
  activityId: true,
  customName: true,
  customCost: true,
  date: true,
  startTime: true,
  durationMins: true,
  sequenceOrder: true,
  notes: true,
  activity: {
    select: {
      id: true,
      name: true,
      category: true,
      estimatedCost: true,
      durationMins: true,
    },
  },
} as const;

function toSummary(item: {
  id: string;
  tripStopId: string;
  activityId: string | null;
  customName: string | null;
  customCost: number | null;
  date: Date;
  startTime: string | null;
  durationMins: number | null;
  sequenceOrder: number;
  notes: string | null;
  activity: {
    id: string;
    name: string;
    category: string;
    estimatedCost: number;
    durationMins: number;
  } | null;
}): ItineraryItemSummary {
  return {
    id: item.id,
    tripStopId: item.tripStopId,
    activityId: item.activityId,
    customName: item.customName,
    customCost: item.customCost,
    date: item.date.toISOString().slice(0, 10),
    startTime: item.startTime,
    durationMins: item.durationMins,
    sequenceOrder: item.sequenceOrder,
    notes: item.notes,
    activity: item.activity,
  };
}

async function loadStop(stopId: string) {
  const stop = await prisma.tripStop.findUnique({
    where: { id: stopId },
    include: { trip: { select: { userId: true } } },
  });
  if (!stop) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "Stop not found");
  }
  return stop;
}

function assertDateWithinStop(
  date: string,
  arrival: Date,
  departure: Date
): void {
  const itemDate = new Date(`${date}T00:00:00.000Z`);
  if (itemDate < arrival || itemDate > departure) {
    throw new AppError(
      400,
      ErrorCodes.INVALID_ITEM_DATE,
      "Item date must be within the stop's arrival and departure dates"
    );
  }
}

export async function createItem(
  userId: string,
  stopId: string,
  input: CreateItemInput
): Promise<ItineraryItemSummary> {
  await assertStopOwnership(userId, stopId);
  const stop = await loadStop(stopId);

  assertDateWithinStop(input.date, stop.arrivalDate, stop.departureDate);

  let resolvedActivityId: string | null = null;
  let resolvedCustomName: string | null = null;
  let resolvedDuration: number | null;

  if (input.activityId) {
    const activity = await prisma.activity.findUnique({
      where: { id: input.activityId },
    });
    if (!activity) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, "Activity not found");
    }
    if (activity.cityId !== stop.cityId) {
      throw new AppError(
        400,
        ErrorCodes.INVALID_ACTIVITY_CITY,
        "Activity does not belong to the stop's city"
      );
    }
    resolvedActivityId = activity.id;
    resolvedDuration = input.durationMins ?? activity.durationMins;
  } else if (input.customName) {
    resolvedCustomName = input.customName;
    resolvedDuration = input.durationMins ?? null;
  } else {
    throw new AppError(
      400,
      ErrorCodes.INVALID_ITINERARY_ITEM,
      "activityId or customName is required"
    );
  }

  const durationMins = resolvedDuration;

  const currentMax = await prisma.itineraryItem.aggregate({
    where: { tripStopId: stopId },
    _max: { sequenceOrder: true },
  });
  const sequenceOrder = (currentMax._max.sequenceOrder ?? 0) + 1;

  const item = await prisma.itineraryItem.create({
    data: {
      tripStopId: stopId,
      activityId: resolvedActivityId,
      customName: resolvedCustomName,
      customCost: input.customCost ?? null,
      date: new Date(`${input.date}T00:00:00.000Z`),
      startTime: input.startTime ?? null,
      durationMins,
      sequenceOrder,
      notes: input.notes ?? null,
    },
    select: itemSelect,
  });

  return toSummary(item);
}

export async function updateItem(
  userId: string,
  itemId: string,
  input: UpdateItemInput
): Promise<ItineraryItemSummary> {
  await assertItemOwnership(userId, itemId);

  const existing = await prisma.itineraryItem.findUnique({
    where: { id: itemId },
    include: { tripStop: true },
  });
  if (!existing) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "Itinerary item not found");
  }

  const newDate = input.date
    ? new Date(`${input.date}T00:00:00.000Z`)
    : existing.date;

  assertDateWithinStop(
    newDate.toISOString().slice(0, 10),
    existing.tripStop.arrivalDate,
    existing.tripStop.departureDate
  );

  const item = await prisma.itineraryItem.update({
    where: { id: itemId },
    data: {
      customCost: input.customCost === undefined ? undefined : input.customCost,
      date: input.date
        ? new Date(`${input.date}T00:00:00.000Z`)
        : undefined,
      startTime:
        input.startTime === undefined ? undefined : input.startTime,
      durationMins:
        input.durationMins === undefined ? undefined : input.durationMins,
      notes: input.notes === undefined ? undefined : input.notes,
    },
    select: itemSelect,
  });

  return toSummary(item);
}

export async function deleteItem(
  userId: string,
  itemId: string
): Promise<void> {
  await assertItemOwnership(userId, itemId);

  const existing = await prisma.itineraryItem.findUnique({
    where: { id: itemId },
  });
  if (!existing) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "Itinerary item not found");
  }

  await prisma.itineraryItem.delete({ where: { id: itemId } });
}

export async function reorderItems(
  userId: string,
  stopId: string,
  input: ReorderItemsInput
): Promise<Array<{ id: string; sequenceOrder: number }>> {
  await assertStopOwnership(userId, stopId);
  const stop = await loadStop(stopId);

  assertDateWithinStop(input.date, stop.arrivalDate, stop.departureDate);

  const items = await prisma.itineraryItem.findMany({
    where: { tripStopId: stopId, date: new Date(`${input.date}T00:00:00.000Z`) },
    select: { id: true },
  });

  const existingIds = new Set(items.map((item) => item.id));
  const providedIds = new Set(input.itemIds);

  if (providedIds.size !== input.itemIds.length) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "itemIds must not contain duplicates"
    );
  }

  for (const id of input.itemIds) {
    if (!existingIds.has(id)) {
      throw new AppError(
        404,
        ErrorCodes.NOT_FOUND,
        `Item ${id} does not belong to this stop on ${input.date}`
      );
    }
  }

  if (input.itemIds.length !== items.length) {
    throw new AppError(
      400,
      ErrorCodes.VALIDATION_ERROR,
      "All items for this stop and date must be included"
    );
  }

  await prisma.$transaction(
    input.itemIds.map((id, index) =>
      prisma.itineraryItem.update({
        where: { id },
        data: { sequenceOrder: index + 1 },
        select: { id: true, sequenceOrder: true },
      })
    )
  );

  return input.itemIds.map((id, index) => ({
    id,
    sequenceOrder: index + 1,
  }));
}