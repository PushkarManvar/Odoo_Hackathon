import { z } from "zod";

const dateOnly = z.string().regex(
  /^\d{4}-\d{2}-\d{2}$/,
  "Date must be YYYY-MM-DD"
);

export const createStopSchema = z
  .object({
    cityId: z.string().min(1, "cityId is required"),
    arrivalDate: dateOnly,
    departureDate: dateOnly,
    notes: z.string().optional().nullable(),
  })
  .refine((d) => d.arrivalDate <= d.departureDate, {
    message: "arrivalDate must be <= departureDate",
    path: ["departureDate"],
  });

export const updateStopSchema = z
  .object({
    arrivalDate: dateOnly.optional(),
    departureDate: dateOnly.optional(),
    notes: z.string().optional().nullable(),
  })
  .refine((d) => {
    if (!d.arrivalDate || !d.departureDate) return true;
    return d.arrivalDate <= d.departureDate;
  }, {
    message: "arrivalDate must be <= departureDate",
    path: ["departureDate"],
  });

export const reorderStopsSchema = z
  .object({
    stopIds: z.array(z.string().min(1)).min(1, "stopIds must not be empty"),
  })
  .refine((d) => new Set(d.stopIds).size === d.stopIds.length, {
    message: "stopIds must not contain duplicates",
    path: ["stopIds"],
  });

export type CreateStopInput = z.infer<typeof createStopSchema>;
export type UpdateStopInput = z.infer<typeof updateStopSchema>;
export type ReorderStopsInput = z.infer<typeof reorderStopsSchema>;