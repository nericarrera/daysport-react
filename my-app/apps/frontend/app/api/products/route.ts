'use client'

import { NextResponse } from "next/server";
import { Product } from "../../types/product";

// Datos de prueba temporalmente
const mockProducts: Product[] = [
  // ... tus productos de prueba aquí
];

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const product = mockProducts.find(p => p.id === Number(params.id));
  
  if (!product) {
    return NextResponse.json(
      { error: "Producto no encontrado" }, 
      { status: 404 }
    );
  }
  
  return NextResponse.json(product);
}