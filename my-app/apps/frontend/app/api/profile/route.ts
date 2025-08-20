import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    console.log('📨 Profile request with token');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const backendResponse = await fetch('http://localhost:3001/users/profile', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseText = await backendResponse.text();
      
      if (responseText.trim().startsWith('<!DOCTYPE')) {
        throw new Error('El backend respondió con HTML');
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        throw new Error('Respuesta inválida del backend en perfil');
      }

      if (!backendResponse.ok) {
        return NextResponse.json(
          { error: responseData.message || `Error ${backendResponse.status}` },
          { status: backendResponse.status }
        );
      }

      console.log('✅ Profile success');
      return NextResponse.json(responseData, { status: backendResponse.status });

    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error('Timeout: El backend no respondió en 5 segundos');
      }
      throw fetchError;
    }
    
  } catch (error: unknown) {
    console.error('❌ Profile API error:', error);
    
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