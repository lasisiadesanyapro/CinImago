import { z } from "zod";

export const ratingSchema = z.object({
  movie: z.string().min(1),
  score: z.number().int().min(1).max(5),
  label: z.string().optional(),
});

export const updateRatingSchema = ratingSchema.partial();
