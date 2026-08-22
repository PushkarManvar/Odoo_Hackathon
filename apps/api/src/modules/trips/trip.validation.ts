import { z } from "zod";

const dateOnly = z.string().regex(
  /^\d{4}-\d{2}-\d{2}$/,
  "Date must be YYYY-MM-DD"
);

const cost = z.number().int().min(0, "Costs must be >= 0").optional();

export const createTripSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    description: z.string().optional().nullable(),
    startDate: dateOnly,
    endDate: dateOnly,
    coverImageUrl: z.string().url().optional().nullable(),
    plannedBudget: z.number().int().min(0).optional().nullable(),
    transportCost: cost,
    stayCost: cost,
    mealCost: cost,
    currency: z.string().min(1).max(10).default("INR"),
  })
  .refine((d) => d.startDate <= d.endDate, {
    message: "startDate must be <= endDate",
    path: ["endDate"],
  });

export const updateTripSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().optional().nullable(),
    startDate: dateOnly.optional(),
    endDate: dateOnly.optional(),
    coverImageUrl: z.string().url().optional().nullable(),
    plannedBudget: z.number().int().min(0).optional().nullable(),
    transportCost: cost,
    stayCost: cost,
    mealCost: cost,
    currency: z.string().min(1).max(10).optional(),
  })
  .refine((d) => {
    if (!d.startDate || !d.endDate) return true;
    return d.startDate <= d.endDate;
  }, {
    message: "startDate must be <= endDate",
    path: ["endDate"],
  });

export type CreateTripInput = z.infer<typeof createTripSchema>;
export type UpdateTripInput = z.infer<typeof updateTripSchema>;