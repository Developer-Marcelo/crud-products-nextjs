import type { Product } from "@/domain/entities/product.entity";
import type { IProductRepository } from "@/domain/repositories/product.repository.interface";
import type { UpdateProductDto } from "../dtos/update-product.dto";

export class UpdateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(id: string, dto: UpdateProductDto): Promise<Product | null> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new Error(`Product with id ${id} not found`);
    }

    const updatedProduct = product.update(dto.name, dto.price, dto.quantity);
    return await this.productRepository.update(id, updatedProduct);
  }
}
