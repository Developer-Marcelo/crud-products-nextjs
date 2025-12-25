import { z } from "zod"

export const buyProductSchema = z.object({
  id: z.string().uuid("Invalid product ID"),
  quantity: z.number().int("Quantity must be an integer").min(1, "Quantity must be at least 1"),
})

export type BuyProductDto = z.infer<typeof buyProductSchema>
