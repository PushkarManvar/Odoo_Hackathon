import type { Prisma } from "@prisma/client";
import { prisma } from "../../config/prisma.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCodes } from "../../common/errors/errorCodes.js";
import { assertTripOwnership } from "../../common/utils/ownership.js";
import type { CreateTripInput, UpdateTripInput } from "./trip.validation.js";

const tripSelect = {
  id: true,
  name: true,
  description: true,
  startDate: true,
  endDate: true,
  coverImageUrl: true,
  plannedBudget: true,
  transportCost: true,
  stayCost: true,
  mealCost: true,
  currency: true,
  visibility: true,
  shareSlug: true,
  createdAt: true,
} satisfies Prisma.TripSelect;

export async function listTrips(userId: string) {
  const trips = await prisma.trip.findMany({
    where: { userId },
    select: {
      ...tripSelect,
      _count: { select: { stops: true } },
    },
    orderBy: { startDate: "asc" },
  });

  return trips.map((trip) => ({
    id: trip.id,
    name: trip.name,
    description: trip.description,
    startDate: trip.startDate.toISOString().slice(0, 10),
    endDate: trip.endDate.toISOString().slice(0, 10),
    coverImageUrl: trip.coverImageUrl,
    plannedBudget: trip.plannedBudget,
    currency: trip.currency,
    visibility: trip.visibility,
    stopCount: trip._count.stops,
    createdAt: trip.createdAt,
  }));
}

export async function getTrip(userId: string, tripId: string) {
  await assertTripOwnership(userId, tripId);

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      stops: {
        orderBy: { sequenceOrder: "asc" },
        include: {
          city: {
            select: {
              id: true,
              name: true,
              country: true,
              region: true,
              imageUrl: true,
            },
          },
          items: {
            orderBy: { sequenceOrder: "asc" },
            include: {
              activity: {
                select: {
                  id: true,
                  name: true,
                  category: true,
                  estimatedCost: true,
                  durationMins: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!trip) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "Trip not found");
  }

  return {
    id: trip.id,
    name: trip.name,
    description: trip.description,
    startDate: trip.startDate.toISOString().slice(0, 10),
    endDate: trip.endDate.toISOString().slice(0, 10),
    coverImageUrl: trip.coverImageUrl,
    plannedBudget: trip.plannedBudget,
    transportCost: trip.transportCost,
    stayCost: trip.stayCost,
    mealCost: trip.mealCost,
    currency: trip.currency,
    visibility: trip.visibility,
    shareSlug: trip.shareSlug,
    stops: trip.stops.map((stop) => ({
      id: stop.id,
      sequenceOrder: stop.sequenceOrder,
      arrivalDate: stop.arrivalDate.toISOString().slice(0, 10),
      departureDate: stop.departureDate.toISOString().slice(0, 10),
      notes: stop.notes,
      city: stop.city,
      items: stop.items.map((item) => ({
        id: item.id,
        activityId: item.activityId,
        customName: item.customName,
        customCost: item.customCost,
        date: item.date.toISOString().slice(0, 10),
        startTime: item.startTime,
        durationMins: item.durationMins,
        sequenceOrder: item.sequenceOrder,
        notes: item.notes,
        activity: item.activity,
      })),
    })),
  };
}

export async function createTrip(userId: string, input: CreateTripInput) {
  const trip = await prisma.trip.create({
    data: {
      userId,
      name: input.name,
      description: input.description ?? null,
      startDate: new Date(`${input.startDate}T00:00:00.000Z`),
      endDate: new Date(`${input.endDate}T00:00:00.000Z`),
      coverImageUrl: input.coverImageUrl ?? null,
      plannedBudget: input.plannedBudget ?? null,
      transportCost: input.transportCost ?? 0,
      stayCost: input.stayCost ?? 0,
      mealCost: input.mealCost ?? 0,
      currency: input.currency ?? "INR",
    },
    select: tripSelect,
  });

  return {
    id: trip.id,
    name: trip.name,
    description: trip.description,
    startDate: trip.startDate.toISOString().slice(0, 10),
    endDate: trip.endDate.toISOString().slice(0, 10),
    plannedBudget: trip.plannedBudget,
    transportCost: trip.transportCost,
    stayCost: trip.stayCost,
    mealCost: trip.mealCost,
    currency: trip.currency,
    visibility: trip.visibility,
    shareSlug: trip.shareSlug,
  };
}

export async function updateTrip(
  userId: string,
  tripId: string,
  input: UpdateTripInput
) {
  await assertTripOwnership(userId, tripId);

  const existing = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { stops: true },
  });

  if (!existing) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "Trip not found");
  }

  const newStart = input.startDate
    ? new Date(`${input.startDate}T00:00:00.000Z`)
    : existing.startDate;
  const newEnd = input.endDate
    ? new Date(`${input.endDate}T00:00:00.000Z`)
    : existing.endDate;

  const stopOutOfRange = existing.stops.some(
    (stop) =>
      stop.arrivalDate < newStart ||
      stop.departureDate > newEnd ||
      stop.arrivalDate > stop.departureDate
  );

  if (stopOutOfRange) {
    throw new AppError(
      409,
      "TRIP_DATE_CONFLICT",
      "Existing trip stops fall outside the new trip date range."
    );
  }

  const trip = await prisma.trip.update({
    where: { id: tripId },
    data: {
      name: input.name,
      description: input.description === undefined ? undefined : input.description,
      startDate: input.startDate
        ? new Date(`${input.startDate}T00:00:00.000Z`)
        : undefined,
      endDate: input.endDate
        ? new Date(`${input.endDate}T00:00:00.000Z`)
        : undefined,
      coverImageUrl:
        input.coverImageUrl === undefined ? undefined : input.coverImageUrl,
      plannedBudget:
        input.plannedBudget === undefined ? undefined : input.plannedBudget,
      transportCost:
        input.transportCost === undefined ? undefined : input.transportCost,
      stayCost: input.stayCost === undefined ? undefined : input.stayCost,
      mealCost: input.mealCost === undefined ? undefined : input.mealCost,
      currency: input.currency,
    },
    select: tripSelect,
  });

  return {
    id: trip.id,
    name: trip.name,
    description: trip.description,
    startDate: trip.startDate.toISOString().slice(0, 10),
    endDate: trip.endDate.toISOString().slice(0, 10),
    plannedBudget: trip.plannedBudget,
    transportCost: trip.transportCost,
    stayCost: trip.stayCost,
    mealCost: trip.mealCost,
    currency: trip.currency,
    visibility: trip.visibility,
    shareSlug: trip.shareSlug,
  };
}

export async function deleteTrip(userId: string, tripId: string) {
  await assertTripOwnership(userId, tripId);
  await prisma.trip.delete({ where: { id: tripId } });
}