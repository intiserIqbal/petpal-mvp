// server/validation/reviewSchemas.js
// Zod validation for reviews

import { z } from "zod";

export const ReviewCreateSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(2000).optional(),
});
