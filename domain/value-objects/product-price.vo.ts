export class ProductPrice {
  constructor(public readonly value: number) {
    if (value < 0.01) {
      throw new Error("Product price must be at least 0.01")
    }
  }

  format(): string {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(this.value)
  }
}
