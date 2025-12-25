import type { Product } from "../entities/product.entity";

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  update(id: string, product: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<void>;
  findById(id: string): Promise<Product | null>;
  list(
    page?: number,
    limit?: number
  ): Promise<{ products: Product[]; total: number }>;
  buy(id: string, quantity: number): Promise<Product | null>;
  sell(id: string, quantity: number): Promise<Product | null>;
}
