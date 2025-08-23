'use client';
export interface Product {
  id: number;           
  name: string;
  price: number;
  category: string;
  subcategory: string | null;  
  images: string[];     
  description?: string;
  sizes: string[];      
  colors: string[];     
  stock: number;
  featured: boolean;
  slug?: string;        
  image?: string;       
  createdAt?: string;
  updatedAt?: string;
}

export interface Category {
  name: string;
  href: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  name: string;
  href: string;
  image?: string;
  slug?: string;       // ← Agregado para consistencia
}