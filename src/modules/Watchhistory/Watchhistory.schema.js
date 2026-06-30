import { z } from "zod";

export const watchHistorySchema = z.object({
  movie: z.string().min(1),
  progressSeconds: z.coerce.number().min(0).optional(),
});

export const updateWatchHistorySchema = watchHistorySchema.partial();
