import { prisma } from "../../config/prisma.js";
import { AppError } from "../../common/errors/AppError.js";
import { ErrorCodes } from "../../common/errors/errorCodes.js";
import { assertTripOwnership } from "../../common/utils/ownership.js";
import type { BudgetSummary } from "./budget.types.js";

const CATEGORY_ORDER = [
  "SIGHTSEEING",
  "FOOD",
  "ADVENTURE",
  "CULTURE",
  "SHOPPING",
  "RELAXATION",
  "OTHER",
];

export async function getBudget(
  userId: string,
  tripId: string
): Promise<BudgetSummary> {
  await assertTripOwnership(userId, tripId);

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      stops: {
        orderBy: { sequenceOrder: "asc" },
        include: {
          city: { select: { name: true } },
          items: {
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

  const transport = trip.transportCost ?? 0;
  const stay = trip.stayCost ?? 0;
  const meals = trip.mealCost ?? 0;

  let activitiesTotal = 0;
  const byStop: BudgetSummary["breakdownByStop"] = [];
  const byCategoryMap = new Map<string, number>();

  for (const stop of trip.stops) {
    let stopCost = 0;
    for (const item of stop.items) {
      const effectiveCost =
        item.customCost ?? item.activity?.estimatedCost ?? 0;
      stopCost += effectiveCost;
      activitiesTotal += effectiveCost;

      const category = item.activity?.category ?? "OTHER";
      byCategoryMap.set(category, (byCategoryMap.get(category) ?? 0) + effectiveCost);
    }
    byStop.push({ stopId: stop.id, cityName: stop.city.name, cost: stopCost });
  }

  const estimatedTotal = transport + stay + meals + activitiesTotal;

  const remaining =
    trip.plannedBudget === null ? null : trip.plannedBudget - estimatedTotal;

  const overBudgetAmount =
    remaining !== null && remaining < 0 ? Math.abs(remaining) : 0;

  const dayCountMs =
    new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime();
  const tripDayCount = Math.floor(dayCountMs / 86_400_000) + 1;

  const averagePerDay =
    tripDayCount > 0 ? Math.round((estimatedTotal / tripDayCount) * 100) / 100 : 0;

  const breakdownByCategory = [...byCategoryMap.entries()]
    .map(([category, cost]) => ({ category, cost }))
    .sort(
      (a, b) =>
        CATEGORY_ORDER.indexOf(a.category) - CATEGORY_ORDER.indexOf(b.category)
    );

  return {
    currency: trip.currency,
    plannedBudget: trip.plannedBudget,
    estimatedTotal,
    remaining,
    overBudgetAmount,
    averagePerDay,
    tripDayCount,
    isOverBudget: remaining !== null && remaining < 0,
    breakdown: { transport, stay, meals, activities: activitiesTotal },
    breakdownByStop: byStop,
    breakdownByCategory,
  };
}