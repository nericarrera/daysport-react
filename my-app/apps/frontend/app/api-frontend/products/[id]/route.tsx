import { NextRequest, NextResponse } from "next/server";

// GET /api-frontend/products/[id]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // 👈 params es Promise
) {
  try {
    // Desestructuramos el id (await necesario porque es Promise en Next.js 15)
    const { id } = await context.params;

    // Llamada a tu backend NestJS
    const response = await fetch(`http://localhost:3001/products/${id}`);

    if (!response.ok) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    // Convertimos la respuesta en JSON
    const product = await response.json();

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("❌ Error en GET /products/[id]:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}