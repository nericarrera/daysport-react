'use server';

import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Next.js 15: params es una Promise
    const resolvedParams = await context.params;
    const productId = resolvedParams.id;
    
    console.log('🔍 Fetching product from backend, ID:', productId);
    
    // Conectar con tu backend JSON Server REAL
    const response = await fetch(`http://localhost:3001/products/${productId}`);
    
    console.log('📊 Backend response status:', response.status);
    
    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json(
          { error: "Producto no encontrado" }, 
          { status: 404 }
        );
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const product = await response.json();
    console.log('✅ Product found:', product?.name);
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('💥 Error in API route:', error);
    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    );
  }
}