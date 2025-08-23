import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const response = await fetch(`http://localhost:3001/products/${params.id}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: "Producto no encontrado" }, 
        { status: 404 }
      );
    }
    
    const product = await response.json();
    return NextResponse.json(product);
  } catch {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}