'use client'

import { NextResponse } from "next/server";
import { products } from "../../../data/Products"; // 👈 Importa tu mock
import { Product } from "../../../types/product";   // 👈 Importa el tipo

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const product = products.find((p: Product) => p.id === Number(params.id));

  if (!product) {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }

  return NextResponse.json(product);
}