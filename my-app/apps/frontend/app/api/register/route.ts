import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📨 Forwarding to backend:', body);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const backendResponse = await fetch('http://localhost:3001/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseText = await backendResponse.text();
      console.log('📋 Backend raw response:', responseText.substring(0, 200));

      // Verificar si es HTML (error)
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.includes('<html')) {
        throw new Error('El backend respondió con HTML en lugar de JSON');
      }

      // Intentar parsear como JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        console.error('❌ El backend no devolvió JSON válido');
        throw new Error('Respuesta inválida del backend');
      }

      if (!backendResponse.ok) {
        return NextResponse.json(
          { 
            error: responseData.message || `Error ${backendResponse.status}` 
          },
          { status: backendResponse.status }
        );
      }

      console.log('✅ Backend success:', responseData);
      return NextResponse.json(responseData, { status: backendResponse.status });

    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error('Timeout: El backend no respondió en 5 segundos');
      }
      throw fetchError;
    }
    
  } catch (error: unknown) {
    console.error('❌ API Route error:', error);
    
    let errorMessage = 'Error interno del servidor';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('Timeout')) {
        errorMessage = 'El backend no respondió a tiempo';
        statusCode = 504;
      } else if (error.message.includes('HTML')) {
        errorMessage = 'Error interno del backend';
        statusCode = 502;
      } else if (error.message.includes('fetch failed')) {
        errorMessage = 'No se pudo conectar al backend';
        statusCode = 503;
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}