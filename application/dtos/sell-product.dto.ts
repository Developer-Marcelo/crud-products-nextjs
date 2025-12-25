import { z } from "zod"

export const sellProductSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
  quantity: z.number().int("Quantity must be an integer").min(1, "Quantity must be at least 1"),
})

export type SellProductDto = z.infer<typeof sellProductSchema>
