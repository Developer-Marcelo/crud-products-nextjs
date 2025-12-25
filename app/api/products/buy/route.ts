import { type NextRequest, NextResponse } from "next/server";
import { productContainer } from "@/infrastructure/di/product.container";
import { buyProductSchema } from "@/application/dtos/buy-product.dto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dto = buyProductSchema.parse(body);

    const product = await productContainer.buyProductUseCase.execute(dto);

    return NextResponse.json({
      id: product.id,
      balance: product.quantity.value,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}
