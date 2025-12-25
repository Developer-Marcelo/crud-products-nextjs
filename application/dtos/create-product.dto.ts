import { z } from "zod";

export const createProductSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(120, "Name must be at most 120 characters long"),
  price: z.number().min(0.01, "Price must be at least 0.01"),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
