import type { Product } from "@/domain/entities/product.entity";
import type { IProductRepository } from "@/domain/repositories/product.repository.interface";
import type { BuyProductDto } from "../dtos/buy-product.dto";

export class BuyProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(dto: BuyProductDto): Promise<Product> {
    try {
      const product = await this.productRepository.buy(dto.id, dto.quantity);
      if (!product) {
        throw new Error(`Product with id ${dto.id} not found`);
      }
      return product;
    } catch (error) {
      throw new Error("Failed to buy product");
    }
  }
}
