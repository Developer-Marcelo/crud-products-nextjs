import { Product } from "@/domain/entities/product.entity";
import type { IProductRepository } from "@/domain/repositories/product.repository.interface";

export class InMemoryProductRepository implements IProductRepository {
  private products: Map<string, Product> = new Map();

  async create(product: Product): Promise<Product> {
    try {
      console.log(process.env.API);
      const request = await fetch(`${process.env.API}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: product.name.value,
          price: product.price.value,
        }),
      });
      if (!request.ok) {
        throw new Error("Error creating product");
      }
      this.products.set(product.id, product);
      return product;
    } catch (error) {
      throw new Error("Error creating product");
    }
  }

  async update(id: string, product: Partial<Product>): Promise<Product | null> {
    try {
      console.log(product);
      const request = await fetch(`${process.env.API}/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: product.name?.value,
          price: product.price?.value,
          quantity: product.quantity?.value,
        }),
      });
      if (!request.ok) {
        throw new Error("Error updating product");
      }
      const updatedProduct = await request.json();

      return updatedProduct;
    } catch (error) {
      throw new Error("Error updating product");
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const request = await fetch(`${process.env.API}/products/${id}`, {
        method: "DELETE",
      });
      if (!request.ok) {
        throw new Error("Error deleting product");
      }
    } catch (error) {
      throw new Error("Error deleting product");
    }
  }

  async findById(id: string): Promise<Product | null> {
    try {
      const request = await fetch(`${process.env.API}/products/${id}`);
      if (!request.ok) {
        throw new Error("Error finding product");
      }
      type outputFindByIdType = {
        id: string;
        name: string;
        price: number;
        quantity: number;
        createdAt: string;
      };
      const product: outputFindByIdType = await request.json();
      return Product.create(
        product.id,
        product.name,
        product.price,
        product.quantity
      );
    } catch (error) {
      throw new Error("Error finding product");
    }
  }

  async list(
    page = 1,
    limit = 10
  ): Promise<{ products: Product[]; total: number }> {
    try {
      const request = await fetch(
        `${process.env.API}/products?page=${page}&limit=${limit}`
      );
      if (!request.ok) {
        throw new Error("Error listing products");
      }
      type outputTypeList = {
        products: {
          id: string;
          name: string;
          price: number;
          quantity: number;
          createdAt: string;
        }[];
        total: number;
      };
      const { products, total }: outputTypeList = await request.json();
      const productsEntity = products.map(
        (product: outputTypeList["products"][0]) =>
          Product.create(
            product.id,
            product.name,
            product.price,
            product.quantity
          )
      );
      return {
        products: productsEntity,
        total: total,
      };
    } catch (error) {
      throw new Error("Error listing products");
    }
  }

  async buy(id: string, quantity: number): Promise<Product | null> {
    try {
      const request = await fetch(`${process.env.API}/products/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          quantity: quantity,
        }),
      });
      if (!request.ok) {
        throw new Error("Error buying product");
      }
      const updatedProduct = await request.json();
      return updatedProduct;
    } catch (error) {
      throw new Error("Error buying product");
    }
  }

  async sell(id: string, quantity: number): Promise<Product | null> {
    try {
      const request = await fetch(`${process.env.API}/products/sell`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          quantity: quantity,
        }),
      });
      if (!request.ok) {
        throw new Error("Error selling product");
      }
      const updatedProduct = await request.json();
      return updatedProduct;
    } catch (error) {
      throw new Error("Error selling product");
    }
  }
}
