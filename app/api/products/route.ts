import { type NextRequest, NextResponse } from "next/server";
import { productContainer } from "@/infrastructure/di/product.container";
import { createProductSchema } from "@/application/dtos/create-product.dto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dto = createProductSchema.parse(body);

    const product = await productContainer.createProductUseCase.execute(dto);

    return NextResponse.json(
      {
        id: product.id,
        name: product.name.value,
        price: product.price.value,
        quantity: 0,
        createdAt: product.createdAt,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = Number.parseInt(searchParams.get("page") || "1");
    const limit = Number.parseInt(searchParams.get("limit") || "10");

    const { products, total } =
      await productContainer.listProductUseCase.execute(page, limit);

    return NextResponse.json({
      products: products.map((product) => ({
        id: product.id,
        name: product.name.value,
        price: product.price.value,
        quantity: product.quantity.value,
        createdAt: product.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
