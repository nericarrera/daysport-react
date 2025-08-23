import { NextResponse } from "next/server";
import { products } from "../../../types/product"; // Ajustá el path

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const product = products.find(p => p.id === Number(params.id));
  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
  return NextResponse.json(product);
}