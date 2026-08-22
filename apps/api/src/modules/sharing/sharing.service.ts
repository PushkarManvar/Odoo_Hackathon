import { prisma } from "../../config/prisma.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCodes } from "../../common/errors/errorCodes.js";
import { assertTripOwnership } from "../../common/utils/ownership.js";
import { generateShareSlug } from "../../common/utils/slug.js";
import type { CopyTripResult, PublicTrip, ShareResult } from "./sharing.types.js";

export async function publishTrip(
  userId: string,
  tripId: string
): Promise<ShareResult> {
  await assertTripOwnership(userId, tripId);

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { visibility: true, shareSlug: true, name: true },
  });

  if (!trip) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "Trip not found");
  }

  if (trip.visibility === "PUBLIC" && trip.shareSlug) {
    return {
      visibility: "PUBLIC",
      shareSlug: trip.shareSlug,
      publicPath: `/public/${trip.shareSlug}`,
    };
  }

  let slug = generateShareSlug(trip.name);
  while (await prisma.trip.findUnique({ where: { shareSlug: slug } })) {
    slug = generateShareSlug(trip.name);
  }

  const updated = await prisma.trip.update({
    where: { id: tripId },
    data: { visibility: "PUBLIC", shareSlug: slug },
    select: { visibility: true, shareSlug: true },
  });

  return {
    visibility: updated.visibility,
    shareSlug: updated.shareSlug,
    publicPath: `/public/${updated.shareSlug}`,
  };
}

export async function unpublishTrip(
  userId: string,
  tripId: string
): Promise<ShareResult> {
  await assertTripOwnership(userId, tripId);

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { id: true },
  });

  if (!trip) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "Trip not found");
  }

  const updated = await prisma.trip.update({
    where: { id: tripId },
    data: { visibility: "PRIVATE", shareSlug: null },
    select: { visibility: true, shareSlug: true },
  });

  return {
    visibility: updated.visibility,
    shareSlug: null,
    publicPath: null,
  };
}

export async function getPublicTrip(slug: string): Promise<PublicTrip> {
  const trip = await prisma.trip.findUnique({
    where: { shareSlug: slug },
    include: {
      user: { select: { name: true } },
      stops: {
        orderBy: { sequenceOrder: "asc" },
        include: {
          city: { select: { name: true, country: true, region: true } },
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

  if (!trip || trip.visibility !== "PUBLIC") {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "Public trip not found");
  }

  let estimatedTotal = 0;
  const stops: PublicTrip["stops"] = trip.stops.map((stop) => {
    const items = stop.items.map((item) => {
      const cost = item.customCost ?? item.activity?.estimatedCost ?? 0;
      estimatedTotal += cost;
      return {
        id: item.id,
        name: item.activity?.name ?? item.customName ?? "Activity",
        date: item.date.toISOString().slice(0, 10),
        startTime: item.startTime,
        durationMins: item.durationMins,
        cost,
        category: item.activity?.category ?? "OTHER",
      };
    });

    return {
      id: stop.id,
      sequenceOrder: stop.sequenceOrder,
      arrivalDate: stop.arrivalDate.toISOString().slice(0, 10),
      departureDate: stop.departureDate.toISOString().slice(0, 10),
      city: stop.city,
      items,
    };
  });

  const fixedCosts =
    (trip.transportCost ?? 0) + (trip.stayCost ?? 0) + (trip.mealCost ?? 0);

  return {
    id: trip.id,
    name: trip.name,
    description: trip.description,
    startDate: trip.startDate.toISOString().slice(0, 10),
    endDate: trip.endDate.toISOString().slice(0, 10),
    coverImageUrl: trip.coverImageUrl,
    currency: trip.currency,
    owner: { name: trip.user.name },
    stops,
    budget: {
      estimatedTotal: estimatedTotal + fixedCosts,
      currency: trip.currency,
    },
  };
}

export async function copyTrip(
  userId: string,
  slug: string
): Promise<CopyTripResult> {
  const source = await prisma.trip.findUnique({
    where: { shareSlug: slug },
    include: {
      stops: {
        orderBy: { sequenceOrder: "asc" },
        include: { items: true },
      },
    },
  });

  if (!source || source.visibility !== "PUBLIC") {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "Public trip not found");
  }

  const newTrip = await prisma.$transaction(async (tx) => {
    const trip = await tx.trip.create({
      data: {
        userId,
        name: source.name,
        description: source.description,
        startDate: source.startDate,
        endDate: source.endDate,
        coverImageUrl: source.coverImageUrl,
        plannedBudget: source.plannedBudget,
        transportCost: source.transportCost,
        stayCost: source.stayCost,
        mealCost: source.mealCost,
        visibility: "PRIVATE",
        currency: source.currency,
      },
    });

    for (const stop of source.stops) {
      await tx.tripStop.create({
        data: {
          tripId: trip.id,
          cityId: stop.cityId,
          sequenceOrder: stop.sequenceOrder,
          arrivalDate: stop.arrivalDate,
          departureDate: stop.departureDate,
          notes: stop.notes,
          items: {
            create: stop.items.map((item) => ({
              activityId: item.activityId,
              customName: item.customName,
              customCost: item.customCost,
              date: item.date,
              startTime: item.startTime,
              durationMins: item.durationMins,
              sequenceOrder: item.sequenceOrder,
              notes: item.notes,
            })),
          },
        },
      });
    }

    return trip;
  });

  return {
    trip: {
      id: newTrip.id,
      name: newTrip.name,
      visibility: "PRIVATE",
      shareSlug: null,
    },
  };
}