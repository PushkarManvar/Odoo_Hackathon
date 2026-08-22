import { AppError } from "../errors/AppError.js";
import { ErrorCodes } from "../errors/errorCodes.js";
import { prisma } from "../../config/prisma.js";

export async function assertTripOwnership(
  userId: string,
  tripId: string
): Promise<void> {
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    select: { userId: true },
  });

  if (!trip) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "Trip not found");
  }

  if (trip.userId !== userId) {
    throw new AppError(403, ErrorCodes.FORBIDDEN, "You do not own this trip");
  }
}

export async function assertStopOwnership(
  userId: string,
  stopId: string
): Promise<void> {
  const stop = await prisma.tripStop.findUnique({
    where: { id: stopId },
    select: { trip: { select: { userId: true } } },
  });

  if (!stop) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "Stop not found");
  }

  if (stop.trip.userId !== userId) {
    throw new AppError(403, ErrorCodes.FORBIDDEN, "You do not own this trip");
  }
}

export async function assertItemOwnership(
  userId: string,
  itemId: string
): Promise<void> {
  const item = await prisma.itineraryItem.findUnique({
    where: { id: itemId },
    select: {
      tripStop: {
        select: { trip: { select: { userId: true } } },
      },
    },
  });

  if (!item) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "Itinerary item not found");
  }

  if (item.tripStop.trip.userId !== userId) {
    throw new AppError(403, ErrorCodes.FORBIDDEN, "You do not own this trip");
  }
}