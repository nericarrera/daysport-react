import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📨 Forwarding to backend:', body);
    
    // Agregar timeout para evitar que se cuelgue
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout

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

      // Leer como texto primero para debug
      const responseText = await backendResponse.text();
      console.log('📋 Backend raw response (first 200 chars):', responseText.substring(0, 200));

      // Verificar si es HTML (error)
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.includes('<html')) {
        throw new Error('El backend respondió con HTML en lugar de JSON. Posible error interno.');
      }

      // Intentar parsear como JSON
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        console.error('❌ El backend no devolvió JSON válido. Contenido:', responseText);
        throw new Error(`Respuesta inválida del backend: ${responseText.substring(0, 100)}...`);
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
    
    // Mensajes de error específicos
    let errorMessage = 'Error interno del servidor';
    let statusCode = 500;

    if (error instanceof Error) {
      if (error.message.includes('Timeout')) {
        errorMessage = 'El backend no respondió a tiempo. Verifica que esté funcionando correctamente.';
        statusCode = 504;
      } else if (error.message.includes('HTML')) {
        errorMessage = 'Error interno del backend. Verifica los logs de NestJS.';
        statusCode = 502;
      } else if (error.message.includes('fetch failed')) {
        errorMessage = 'No se pudo conectar al backend. Asegúrate de que NestJS esté corriendo en puerto 3001.';
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