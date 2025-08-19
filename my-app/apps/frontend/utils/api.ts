export const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";

export const ENDPOINTS = {
  login: "/auth/login",
  register: "/users",
  profile: "/users/profile",
  sendResetPassword: "/auth/send-reset-password",
  resetPassword: "/auth/reset-password",
};

// Función genérica para llamadas a la API
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, options);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.message || "Error en la solicitud");
    }

    return data;
  } catch (error) {
    console.error("API Fetch Error:", error);
    throw error;
  }
}