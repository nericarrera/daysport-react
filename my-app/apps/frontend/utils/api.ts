export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:3001";

export const ENDPOINTS = {
  login: "/auth/login",
  register: "/users",
  profile: "/users/profile",
  sendResetPassword: "/auth/send-reset-password",
  resetPassword: "/auth/reset-password",
};

// Interfaces para tipado
interface ApiError {
  message?: string;
  status?: number;
}

interface ApiResponse {
  [key: string]: unknown;
}

// Función genérica mejorada para llamadas a la API
export async function apiFetch<T = ApiResponse>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`🔄 API Call: ${options.method || 'GET'} ${url}`);
    
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    // Verificar si la respuesta es JSON
    const contentType = res.headers.get('content-type');
    let data: T | string;
    
    if (contentType?.includes('application/json')) {
      data = await res.json() as T;
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const errorMessage = typeof data === 'object' 
        ? (data as ApiError)?.message || `Error ${res.status}: ${res.statusText}`
        : `Error ${res.status}: ${data}`;
      
      throw new Error(errorMessage);
    }

    console.log(`✅ API Success: ${options.method || 'GET'} ${endpoint}`);
    return data as T;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Timeout: El servidor no respondió en 8 segundos');
    }
    
    console.error('❌ API Fetch Error:', error);
    
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error('Error desconocido en la API');
    }
  }
}

// Interfaces para las respuestas de autenticación
interface LoginResponse {
  user?: {
    name?: string;
    email?: string;
  };
  access_token?: string;
}

interface RegisterResponse {
  user?: {
    name?: string;
    email?: string;
  };
  success?: boolean;
}

interface ProfileResponse {
  id: number;
  email: string;
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  birthDate?: string | null;
  createdAt: string;
}

// Funciones específicas para mejor reutilización
export const apiAuth = {
  login: (credentials: { email: string; password: string }) => 
    apiFetch<LoginResponse>(ENDPOINTS.login, {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  register: (userData: { email: string; password: string; name?: string }) => 
    apiFetch<RegisterResponse>(ENDPOINTS.register, {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  getProfile: (token: string) => 
    apiFetch<ProfileResponse>(ENDPOINTS.profile, {
      headers: { Authorization: `Bearer ${token}` },
    }),
};