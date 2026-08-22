import { z } from "zod";

export const listActivitiesQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  category: z
    .enum([
      "SIGHTSEEING",
      "FOOD",
      "ADVENTURE",
      "CULTURE",
      "SHOPPING",
      "RELAXATION",
      "OTHER",
    ])
    .optional(),
  maxCost: z.coerce.number().int().min(0).optional(),
  maxDuration: z.coerce.number().int().min(0).optional(),
  sort: z
    .enum(["cost", "name", "duration"])
    .optional()
    .default("name"),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

export const cityIdParamSchema = z.object({
  cityId: z.string().min(1).max(100),
});

export type ListActivitiesQuery = z.infer<typeof listActivitiesQuerySchema>;
export type CityIdParam = z.infer<typeof cityIdParamSchema>;