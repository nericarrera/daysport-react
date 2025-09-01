import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // ← Next.js 15: params es Promise
) {
  try {
    // ✅ CORRECTO: Desempaquetar params para Next.js 15
    const resolvedParams = await context.params;
    const { id } = resolvedParams;
    
    console.log('🔍 Fetching product ID:', id);
    
    // Tu lógica para obtener el producto...
    const response = await fetch(`http://localhost:3001/api/products/${id}`);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Producto no encontrado' },
        { status: 404 }
      );
    }
    
    const product = await response.json();
    return NextResponse.json(product);
    
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Si tienes otros métodos, actualízalos también:
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await context.params;
  const { id } = resolvedParams;
  // ... tu lógica POST
}

export async function PUT(
  request: NextRequest, 
  context: { params: Promise<{ id: string }> }
) {
  const resolvedParams = await context.params;
  const { id } = resolvedParams;
  // ... tu lógica PUT
}