import { z } from "zod"

export const updateProductSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(120, "Name must be at most 120 characters long")
    .optional(),
  price: z.number().min(0.01, "Price must be at least 0.01").optional(),
  quantity: z.number().int("Quantity must be an integer").min(0, "Quantity cannot be negative").optional(),
})

export type UpdateProductDto = z.infer<typeof updateProductSchema>
