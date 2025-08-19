import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log('📨 Forwarding to backend:', body);
    
    const response = await fetch('http://localhost:3001/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { 
          error: errorData.message || `Error ${response.status}: ${response.statusText}` 
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Backend response:', data);
    
    return NextResponse.json(data, { status: response.status });
  } catch (error: unknown) {
    console.error('❌ API Route error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}