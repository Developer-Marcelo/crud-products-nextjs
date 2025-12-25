export class ProductName {
  constructor(public readonly value: string) {
    if (!value || value.trim().length < 3) {
      throw new Error("Product name must be at least 3 characters long")
    }
    if (value.length > 120) {
      throw new Error("Product name must be at most 120 characters long")
    }
  }
}
