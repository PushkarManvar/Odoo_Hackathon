import { z } from "zod";

export const tripIdParamSchema = z.object({
  tripId: z.string().min(1).max(100),
});

export const publicSlugParamSchema = z.object({
  slug: z.string().min(1).max(100),
});

export type TripIdParam = z.infer<typeof tripIdParamSchema>;
export type PublicSlugParam = z.infer<typeof publicSlugParamSchema>;