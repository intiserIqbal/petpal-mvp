// server/validation/reviewSchemas.js
// Zod validation for reviews

const { z } = require("zod");

const ReviewCreateSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().max(2000).optional(),
});

module.exports = {
  ReviewCreateSchema,
};
