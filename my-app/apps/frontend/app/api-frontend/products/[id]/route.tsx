import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const url = `http://localhost:3001/api/products/${id}`;

    const response = await fetch(url);
    if (!response.ok) {
      return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
    }

    const product = await response.json();
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: "Error al obtener producto" },
      { status: 500 }
    );
  }
}