import type { Product } from "@/domain/entities/product.entity"
import type { IProductRepository } from "@/domain/repositories/product.repository.interface"

export class FindByIdProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id)
    if (!product) {
      throw new Error(`Product with id ${id} not found`)
    }
    return product
  }
}
