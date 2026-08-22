import { z } from "zod";

const dateOnly = z.string().regex(
  /^\d{4}-\d{2}-\d{2}$/,
  "Date must be YYYY-MM-DD"
);

const timeOnly = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must be HH:mm (24-hour)");

const cost = z.number().int().min(0, "Costs must be >= 0");

const duration = z.number().int().positive("Duration must be > 0 minutes");

export const createItemSchema = z
  .object({
    activityId: z.string().min(1).optional(),
    customName: z.string().min(1).max(200).optional(),
    customCost: cost.optional(),
    date: dateOnly,
    startTime: timeOnly.optional().nullable(),
    durationMins: duration.optional(),
    notes: z.string().max(1000).optional().nullable(),
  })
  .refine((d) => d.activityId || d.customName, {
    message: "activityId or customName is required",
    path: ["activityId"],
  })
  .refine((d) => !(d.activityId && d.customName), {
    message: "Provide either activityId or customName, not both",
    path: ["customName"],
  });

export const updateItemSchema = z
  .object({
    customCost: cost.optional(),
    date: dateOnly.optional(),
    startTime: timeOnly.optional().nullable(),
    durationMins: duration.optional(),
    notes: z.string().max(1000).optional().nullable(),
  })
  .refine((d) => Object.keys(d).length > 0, {
    message: "At least one field is required",
    path: ["date"],
  });

export const stopIdParamSchema = z.object({
  stopId: z.string().min(1).max(100),
});

export const itemIdParamSchema = z.object({
  itemId: z.string().min(1).max(100),
});

export const reorderItemsSchema = z.object({
  date: dateOnly,
  itemIds: z.array(z.string().min(1)).min(1),
});

export type CreateItemInput = z.infer<typeof createItemSchema>;
export type UpdateItemInput = z.infer<typeof updateItemSchema>;
export type StopIdParam = z.infer<typeof stopIdParamSchema>;
export type ItemIdParam = z.infer<typeof itemIdParamSchema>;
export type ReorderItemsInput = z.infer<typeof reorderItemsSchema>;