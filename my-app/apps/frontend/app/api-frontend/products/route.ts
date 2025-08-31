'use server'; // ← CAMBIAR 'use client' por 'use server'

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    
    // Conectar con backend REAL
    let url = 'http://localhost:3001/products';
    if (category && category !== 'all') {
      url += `?category=${category}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json([], { status: 200 });
    }
    
    const products = await response.json();
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json([], { status: 200 });
  }
}