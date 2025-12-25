import { CreateProductUseCase } from "@/application/use-cases/create-product.use-case"
import { UpdateProductUseCase } from "@/application/use-cases/update-product.use-case"
import { DeleteProductUseCase } from "@/application/use-cases/delete-product.use-case"
import { FindByIdProductUseCase } from "@/application/use-cases/find-by-id-product.use-case"
import { ListProductUseCase } from "@/application/use-cases/list-product.use-case"
import { BuyProductUseCase } from "@/application/use-cases/buy-product.use-case"
import { SellProductUseCase } from "@/application/use-cases/sell-product.use-case"
import { InMemoryProductRepository } from "../repositories/in-memory-product.repository"

const productRepository = new InMemoryProductRepository()

export const productContainer = {
  createProductUseCase: new CreateProductUseCase(productRepository),
  updateProductUseCase: new UpdateProductUseCase(productRepository),
  deleteProductUseCase: new DeleteProductUseCase(productRepository),
  findByIdProductUseCase: new FindByIdProductUseCase(productRepository),
  listProductUseCase: new ListProductUseCase(productRepository),
  buyProductUseCase: new BuyProductUseCase(productRepository),
  sellProductUseCase: new SellProductUseCase(productRepository),
}
