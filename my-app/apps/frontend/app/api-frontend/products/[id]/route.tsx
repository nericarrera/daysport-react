import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await context.params;
    const { id } = resolvedParams;
    
    console.log('🔄 Fetching product from NestJS backend, ID:', id);
    
    // ✅ Usa el endpoint CORRECTO de NestJS
    const response = await fetch(`http://localhost:3001/api/products/${id}`);
    
    console.log('📊 NestJS response status:', response.status);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: "Producto no encontrado" }, 
        { status: 404 }
      );
    }
    
    const product = await response.json();
    console.log('✅ Product found in NestJS:', product.name);
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('💥 Error fetching product from NestJS:', error);
    return NextResponse.json(
      { error: "Error interno del servidor" }, 
      { status: 500 }
    );
  }
}