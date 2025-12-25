import { type NextRequest, NextResponse } from "next/server";
import { productContainer } from "@/infrastructure/di/product.container";
import { sellProductSchema } from "@/application/dtos/sell-product.dto";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dto = sellProductSchema.parse(body);

    const product = await productContainer.sellProductUseCase.execute(dto);

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
