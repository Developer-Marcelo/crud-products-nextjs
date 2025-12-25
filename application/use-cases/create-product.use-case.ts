import { Product } from "@/domain/entities/product.entity";
import type { IProductRepository } from "@/domain/repositories/product.repository.interface";
import type { CreateProductDto } from "../dtos/create-product.dto";

export class CreateProductUseCase {
  constructor(private readonly productRepository: IProductRepository) {}

  async execute(dto: CreateProductDto): Promise<Product> {
    const product = Product.create(crypto.randomUUID(), dto.name, dto.price, 0);
    return await this.productRepository.create(product);
  }
}
