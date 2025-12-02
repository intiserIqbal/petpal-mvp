// server/validation/petSchemas.js
// Zod validation schemas for creating/updating pets & searching.

import { z } from "zod";

const locationSchema = z.object({
  city: z.string().max(100).optional(),
  region: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
}).optional();

const imageItemSchema = z.object({
  url: z.string().url(),
  public_id: z.string().optional(),
}).or(z.string().url());  // allow simple URL strings too

// ---------- CREATE PET ----------
export const PetCreateSchema = z.object({
  name: z.string().min(1, "Name required").max(120),
  species: z.string().min(1, "Species required").max(60),
  breed: z.string().max(80).optional(),
  age: z.number().min(0).optional(),
  sex: z.enum(["male", "female", "unknown"]).optional(),
  description: z.string().min(1).max(3000),
  location: locationSchema,
  images: z.array(imageItemSchema).max(10).optional(),
});

// ---------- UPDATE PET ----------
export const PetUpdateSchema = PetCreateSchema.partial();

// ---------- SEARCH QUERY ----------
export const PetSearchSchema = z.object({
  q: z.string().optional(),
  species: z.string().optional(),
  city: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional(),
});
