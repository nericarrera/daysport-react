import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  context: { params: Promise<Record<string, never>> } // ← Para rutas sin params
) {
  try {
    const body = await request.json();
    // Tu lógica GraphQL aquí
    return NextResponse.json({ data: {} });
  } catch (error) {
    return NextResponse.json(
      { error: 'Error processing GraphQL request' },
      { status: 500 }
    );
  }
}