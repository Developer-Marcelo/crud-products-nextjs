import type { Product } from "@/domain/entities/product.entity"
import type { IProductRepository } from "@/domain/repositories/product.repository.interface"

export class ListProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(page = 1, limit = 10): Promise<{ products: Product[]; total: number }> {
    return await this.productRepository.list(page, limit)
  }
}
