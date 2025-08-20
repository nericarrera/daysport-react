// app/api/profile/route.ts - VERSIÓN CON MÁS DEBUG
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Iniciando API /api/profile');
    
    const authHeader = request.headers.get('Authorization');
    console.log('📨 Authorization header:', authHeader);
    
    if (!authHeader?.startsWith('Bearer ')) {
      console.log('❌ No Bearer token found');
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    console.log('🔐 Token recibido:', token);
    console.log('📏 Longitud token:', token.length);
    
    // Verifica que el token tenga el formato básico de JWT
    const tokenParts = token.split('.');
    console.log('🧩 Partes del token:', tokenParts.length);
    
    if (tokenParts.length !== 3) {
      console.log('❌ Token no tiene formato JWT válido (3 partes)');
      return NextResponse.json(
        { error: 'Token con formato inválido' },
        { status: 401 }
      );
    }

    console.log('🔄 Llamando al backend: http://localhost:3001/users/profile');
    
    const backendResponse = await fetch('http://localhost:3001/users/profile', {
      method: 'GET',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    console.log('📊 Backend response status:', backendResponse.status);
    console.log('📊 Backend response ok:', backendResponse.ok);

    // SI el backend responde con 401, devuelve 401 al frontend
    if (backendResponse.status === 401) {
      console.log('🔒 Backend respondió con 401 - Token inválido');
      return NextResponse.json(
        { error: 'Token inválido o expirado' },
        { status: 401 }
      );
    }

    if (!backendResponse.ok) {
      console.log('❌ Backend respondió con error:', backendResponse.status);
      const errorText = await backendResponse.text();
      console.log('📄 Backend error response:', errorText);
      
      return NextResponse.json(
        { error: `Error ${backendResponse.status}: ${errorText}` },
        { status: backendResponse.status }
      );
    }

    console.log('✅ Backend respondió correctamente');
    const responseData = await backendResponse.json();
    console.log('📦 Datos del perfil recibidos');
    
    return NextResponse.json(responseData, { status: 200 });

  } catch (error: unknown) {
    console.error('💥 ERROR en API /api/profile:', error);
    
    // Mejor mensaje de error
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Error interno del servidor';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}