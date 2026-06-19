import { z } from "zod";

export const reviewSchema = z.object({
  movie: z.string().min(1),
  comment: z.string().min(1),
});

export const updateReviewSchema = reviewSchema.partial();
