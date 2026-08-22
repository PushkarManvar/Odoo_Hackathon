import type { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCodes } from "../../common/errors/errorCodes.js";
import { assertTripOwnership } from "../../common/utils/ownership.js";
import type {
  CreateStopInput,
  ReorderStopsInput,
  UpdateStopInput,
} from "./stop.validation.js";

const stopSelect = {
  id: true,
  tripId: true,
  sequenceOrder: true,
  arrivalDate: true,
  departureDate: true,
  notes: true,
  city: {
    select: {
      id: true,
      name: true,
      country: true,
    },
  },
} satisfies Prisma.TripStopSelect;

function toDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
}

function toDateOnly(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function assertWithinTripRange(
  arrival: Date,
  departure: Date,
  tripStart: Date,
  tripEnd: Date
): void {
  if (arrival < tripStart || departure > tripEnd) {
    throw new AppError(
      409,
      "STOP_OUTSIDE_TRIP_RANGE",
      "Stop dates must fall inside the trip date range."
    );
  }
}

async function assertStopOwnership(userId: string, stopId: string) {
  const stop = await prisma.tripStop.findUnique({
    where: { id: stopId },
    select: { tripId: true },
  });

  if (!stop) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "Stop not found");
  }

  await assertTripOwnership(userId, stop.tripId);
}

export async function createStop(
  userId: string,
  tripId: string,
  input: CreateStopInput
) {
  await assertTripOwnership(userId, tripId);

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { startDate: true, endDate: true },
  });

  if (!trip) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "Trip not found");
  }

  const city = await prisma.city.findUnique({
    where: { id: input.cityId },
    select: { id: true },
  });

  if (!city) {
    throw new AppError(404, "CITY_NOT_FOUND", "City not found");
  }

  const arrival = toDate(input.arrivalDate);
  const departure = toDate(input.departureDate);

  assertWithinTripRange(arrival, departure, trip.startDate, trip.endDate);

  const stop = await prisma.$transaction(async (tx) => {
    const { _count } = await tx.tripStop.aggregate({
      where: { tripId },
      _count: { _all: true },
    });

    return tx.tripStop.create({
      data: {
        tripId,
        cityId: input.cityId,
        sequenceOrder: _count._all + 1,
        arrivalDate: arrival,
        departureDate: departure,
        notes: input.notes ?? null,
      },
      select: stopSelect,
    });
  });

  return {
    id: stop.id,
    tripId: stop.tripId,
    sequenceOrder: stop.sequenceOrder,
    arrivalDate: toDateOnly(stop.arrivalDate),
    departureDate: toDateOnly(stop.departureDate),
    notes: stop.notes,
    city: stop.city,
  };
}

export async function updateStop(
  userId: string,
  stopId: string,
  input: UpdateStopInput
) {
  await assertStopOwnership(userId, stopId);

  const existing = await prisma.tripStop.findUnique({
    where: { id: stopId },
    include: {
      trip: { select: { startDate: true, endDate: true } },
      items: { select: { date: true } },
    },
  });

  if (!existing) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "Stop not found");
  }

  const newArrival = input.arrivalDate
    ? toDate(input.arrivalDate)
    : existing.arrivalDate;
  const newDeparture = input.departureDate
    ? toDate(input.departureDate)
    : existing.departureDate;

  assertWithinTripRange(
    newArrival,
    newDeparture,
    existing.trip.startDate,
    existing.trip.endDate
  );

  const itemOutOfRange = existing.items.some(
    (item) => item.date < newArrival || item.date > newDeparture
  );

  if (itemOutOfRange) {
    throw new AppError(
      409,
      "STOP_DATE_CONFLICT",
      "Existing itinerary items fall outside the new stop date range."
    );
  }

  const stop = await prisma.tripStop.update({
    where: { id: stopId },
    data: {
      arrivalDate: input.arrivalDate ? toDate(input.arrivalDate) : undefined,
      departureDate: input.departureDate
        ? toDate(input.departureDate)
        : undefined,
      notes: input.notes === undefined ? undefined : input.notes,
    },
    select: stopSelect,
  });

  return {
    id: stop.id,
    tripId: stop.tripId,
    sequenceOrder: stop.sequenceOrder,
    arrivalDate: toDateOnly(stop.arrivalDate),
    departureDate: toDateOnly(stop.departureDate),
    notes: stop.notes,
    city: stop.city,
  };
}

export async function deleteStop(userId: string, stopId: string) {
  await assertStopOwnership(userId, stopId);

  await prisma.$transaction(async (tx) => {
    const stop = await tx.tripStop.findUnique({
      where: { id: stopId },
      select: { tripId: true },
    });

    if (!stop) {
      throw new AppError(404, ErrorCodes.NOT_FOUND, "Stop not found");
    }

    await tx.tripStop.delete({ where: { id: stopId } });

    const remaining = await tx.tripStop.findMany({
      where: { tripId: stop.tripId },
      orderBy: { sequenceOrder: "asc" },
      select: { id: true },
    });

    for (let i = 0; i < remaining.length; i += 1) {
      await tx.tripStop.update({
        where: { id: remaining[i].id },
        data: { sequenceOrder: i + 1 },
      });
    }
  });
}

export function validateReorderIds(
  stopIds: string[],
  existingIds: string[]
): string | null {
  if (stopIds.length !== existingIds.length) {
    return "Reordering requires every trip stop to be included.";
  }

  const allBelongToTrip = stopIds.every((id) => existingIds.includes(id));

  if (!allBelongToTrip) {
    return "Every supplied stop must belong to this trip.";
  }

  return null;
}

export async function reorderStops(
  userId: string,
  tripId: string,
  input: ReorderStopsInput
) {
  await assertTripOwnership(userId, tripId);

  const existing = await prisma.tripStop.findMany({
    where: { tripId },
    select: { id: true },
  });

  const existingIds = existing.map((s) => s.id);

  const reorderError = validateReorderIds(input.stopIds, existingIds);

  if (reorderError) {
    throw new AppError(400, ErrorCodes.VALIDATION_ERROR, reorderError);
  }

  const stops = await prisma.$transaction(async (tx) => {
    const updated: Array<{ id: string; sequenceOrder: number }> = [];

    for (let i = 0; i < input.stopIds.length; i += 1) {
      await tx.tripStop.update({
        where: { id: input.stopIds[i] },
        data: { sequenceOrder: i + 1 },
      });
      updated.push({ id: input.stopIds[i], sequenceOrder: i + 1 });
    }

    return updated;
  });

  return stops;
}