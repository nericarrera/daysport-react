import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");

    // ✅ Endpoint correcto del backend (NestJS)
    let url = "http://localhost:3001/api/products";

    // Agregar query params si existen
    const query: string[] = [];
    if (category) query.push(`category=${category}`);
    if (subcategory) query.push(`subcategory=${subcategory}`);

    if (query.length > 0) {
      url += `?${query.join("&")}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      return NextResponse.json(
        { error: "No se pudieron obtener los productos" },
        { status: response.status }
      );
    }

    const products = await response.json();
    return NextResponse.json(products);
  } catch (error) {
    console.error("❌ Error en GET /api/products:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}