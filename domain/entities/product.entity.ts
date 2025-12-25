import { ProductName } from "../value-objects/product-name.vo";
import { ProductPrice } from "../value-objects/product-price.vo";
import { ProductQuantity } from "../value-objects/product-quantity.vo";

export class Product {
  constructor(
    public readonly id: string,
    public readonly name: ProductName,
    public readonly price: ProductPrice,
    public readonly quantity: ProductQuantity,
    public readonly createdAt: Date
  ) {}

  static create(
    id: string,
    name: string,
    price: number,
    quantity = 0
  ): Product {
    return new Product(
      id,
      new ProductName(name),
      new ProductPrice(price),
      new ProductQuantity(quantity),
      new Date()
    );
  }

  update(name?: string, price?: number, quantity?: number): Product {
    return new Product(
      this.id,
      name ? new ProductName(name) : this.name,
      price !== undefined ? new ProductPrice(price) : this.price,
      quantity !== undefined ? new ProductQuantity(quantity) : this.quantity,
      this.createdAt
    );
  }

  buy(quantity: number): Product {
    return new Product(
      this.id,
      this.name,
      this.price,
      this.quantity.add(quantity),
      this.createdAt
    );
  }

  sell(quantity: number): Product {
    return new Product(
      this.id,
      this.name,
      this.price,
      this.quantity.subtract(quantity),
      this.createdAt
    );
  }
}
