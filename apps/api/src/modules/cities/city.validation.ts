import { z } from "zod";

export const listCitiesQuerySchema = z.object({
  search: z.string().trim().max(100).optional(),
  country: z.string().trim().max(100).optional(),
  region: z.string().trim().max(100).optional(),
  sort: z.enum(["popularity", "name"]).optional().default("popularity"),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
});

export const cityIdParamSchema = z.object({
  cityId: z.string().min(1).max(100),
});

export type ListCitiesQuery = z.infer<typeof listCitiesQuerySchema>;
export type CityIdParam = z.infer<typeof cityIdParamSchema>;