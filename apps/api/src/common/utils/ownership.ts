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