import { NextRequest, NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // ✅ Usar NestJS endpoint
    let url = 'http://localhost:3001/api/products';
    if (category) {
      url += `?category=${category}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json([], { status: 200 });
    }
    
    const products = await response.json();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}