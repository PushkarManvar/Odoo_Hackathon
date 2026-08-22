import { prisma } from "../../config/prisma.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCodes } from "../../common/errors/errorCodes.js";
import type { ActivitySummary } from "./activity.types.js";
import type { ListActivitiesQuery } from "./activity.validation.js";

function toSummary(activity: {
  id: string;
  cityId: string;
  name: string;
  description: string | null;
  category: string;
  estimatedCost: number;
  durationMins: number;
  imageUrl: string | null;
}): ActivitySummary {
  return {
    id: activity.id,
    cityId: activity.cityId,
    name: activity.name,
    description: activity.description,
    category: activity.category,
    estimatedCost: activity.estimatedCost,
    durationMins: activity.durationMins,
    imageUrl: activity.imageUrl,
  };
}

export async function listCityActivities(
  cityId: string,
  query: ListActivitiesQuery
): Promise<ActivitySummary[]> {
  const city = await prisma.city.findUnique({ where: { id: cityId } });
  if (!city) {
    throw new AppError(404, ErrorCodes.NOT_FOUND, "City not found");
  }

  const { search, category, maxCost, maxDuration, sort, limit } = query;

  const activities = await prisma.activity.findMany({
    where: {
      cityId,
      ...(search
        ? { name: { contains: search, mode: "insensitive" } }
        : {}),
      ...(category ? { category } : {}),
      ...(maxCost !== undefined ? { estimatedCost: { lte: maxCost } } : {}),
      ...(maxDuration !== undefined ? { durationMins: { lte: maxDuration } } : {}),
    },
    orderBy:
      sort === "cost"
        ? { estimatedCost: "asc" }
        : sort === "duration"
          ? { durationMins: "asc" }
          : { name: "asc" },
    take: limit,
  });

  return activities.map(toSummary);
}