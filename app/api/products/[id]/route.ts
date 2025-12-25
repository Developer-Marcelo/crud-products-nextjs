import { type NextRequest, NextResponse } from "next/server";
import { productContainer } from "@/infrastructure/di/product.container";
import { updateProductSchema } from "@/application/dtos/update-product.dto";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await productContainer.findByIdProductUseCase.execute(id);

    return NextResponse.json({
      id: product.id,
      name: product.name.value,
      price: product.price.value,
      quantity: product.quantity.value,
      createdAt: product.createdAt,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 404 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const dto = updateProductSchema.parse(body);

    const product = await productContainer.updateProductUseCase.execute(
      id,
      dto
    );

    if (!product) {
      return NextResponse.json(
        { error: `Product with id ${id} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: product.id,
      name: product.name.value,
      price: product.price.value,
      quantity: product.quantity.value,
      createdAt: product.createdAt,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await productContainer.deleteProductUseCase.execute(id);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 404 }
    );
  }
}
