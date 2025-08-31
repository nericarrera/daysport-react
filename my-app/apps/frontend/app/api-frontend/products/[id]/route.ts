import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // ← Next.js 15: params es Promise
) {
  try {
    // Desempaquetar params
    const resolvedParams = await context.params;
    const { id } = resolvedParams;
    
    // Tu lógica aquí...
    const response = await fetch(`http://localhost:3001/products/${id}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    const product = await response.json();
    return NextResponse.json(product);
  } catch (error) {
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}