import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    console.log('🔍 Authorization header:', authHeader);
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No Bearer token found');
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    console.log('📨 Profile request with token:', token.substring(0, 10) + '...');
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      console.log('🔄 Calling backend: http://localhost:3001/users/profile');
      
      const backendResponse = await fetch('http://localhost:3001/users/profile', {
        method: 'GET',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log('📊 Backend response status:', backendResponse.status);
      
      const responseText = await backendResponse.text();
      console.log('📄 Backend response text:', responseText.substring(0, 200) + '...');
      
      if (responseText.trim().startsWith('<!DOCTYPE')) {
        console.log('❌ Backend responded with HTML instead of JSON');
        throw new Error('El backend respondió con HTML');
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('✅ Parsed JSON response');
      } catch {
        console.log('❌ Failed to parse JSON response');
        throw new Error('Respuesta inválida del backend en perfil');
      }

      if (!backendResponse.ok) {
        console.log('❌ Backend error:', responseData);
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
        console.log('❌ Timeout: Backend no respondió en 5 segundos');
        throw new Error('Timeout: El backend no respondió en 5 segundos');
      }
      console.log('❌ Fetch error:', fetchError);
      throw fetchError;
    }
    
  } catch (error: unknown) {
    console.error('💥 Profile API error:', error);
    
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