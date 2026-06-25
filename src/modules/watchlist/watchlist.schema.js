import { z } from "zod";

export const watchlistSchema = z.object({
  movie: z.string().min(1),
});
