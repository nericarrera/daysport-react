import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log('📨 Login request for:', email);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const backendResponse = await fetch('http://localhost:3001/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const responseText = await backendResponse.text();
      
      if (responseText.trim().startsWith('<!DOCTYPE') || responseText.includes('<html')) {
        throw new Error('El backend respondió con HTML en lugar de JSON');
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch {
        throw new Error('Respuesta inválida del backend en login');
      }

      if (!backendResponse.ok) {
        return NextResponse.json(
          { error: responseData.message || `Error ${backendResponse.status}` },
          { status: backendResponse.status }
        );
      }

      console.log('✅ Login success for:', email);
      return NextResponse.json(responseData, { status: backendResponse.status });

    } catch (fetchError: unknown) {
      clearTimeout(timeoutId);
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        throw new Error('Timeout: El backend no respondió en 5 segundos');
      }
      throw fetchError;
    }
    
  } catch (error: unknown) {
    console.error('❌ Login API error:', error);
    
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