import type { Product } from "@/domain/entities/product.entity";
import type { IProductRepository } from "@/domain/repositories/product.repository.interface";
import type { SellProductDto } from "../dtos/sell-product.dto";

export class SellProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(dto: SellProductDto): Promise<Product> {
    try {
      const product = await this.productRepository.sell(dto.id, dto.quantity);
      if (!product) {
        throw new Error(`Product with id ${dto.id} not found`);
      }
      return product;
    } catch (error) {
      throw new Error("Failed to sell product");
    }
  }
}
