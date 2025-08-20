// app/api/profile/route.ts - CÓDIGO COMPLETO CORREGIDO
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    
    // DEBUG: Verifica el token
    console.log('🔐 Token recibido:', token);
    console.log('📏 Longitud token:', token.length);
    
    const backendResponse = await fetch('http://localhost:3001/users/profile', {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    // SI el backend responde con 401, devuelve 401 al frontend
    if (backendResponse.status === 401) {
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    if (!backendResponse.ok) {
      const errorData = await backendResponse.json();
      return NextResponse.json(
        { error: errorData.message || `Error ${backendResponse.status}` },
        { status: backendResponse.status }
      );
    }

    const responseData = await backendResponse.json();
    return NextResponse.json(responseData, { status: 200 });

  } catch (error: unknown) {
    console.error('❌ Profile API error:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}