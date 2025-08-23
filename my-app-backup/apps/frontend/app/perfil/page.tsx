'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UsuarioPerfil {
  id: number;
  email: string;
  name?: string;
  phone?: string;
  address?: string;
  birthDate?: string;
  createdAt?: string;
}

export default function PerfilPage() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarPerfil = async () => {
      const token = localStorage.getItem("token");
      
      console.log("🔍 Token encontrado:", token ? "SÍ" : "NO");
      
      if (!token) {
        console.log("❌ No hay token, redirigiendo a login");
        router.push("/iniciar-sesion");
        return;
      }

      try {
        setCargando(true);
        console.log("📡 Haciendo request a /api/profile...");
        
        const response = await fetch('/api/profile', {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        console.log("📊 Response status:", response.status);
        console.log("📊 Response ok:", response.ok);

        if (response.ok) {
          const data = await response.json();
          console.log("✅ Datos del perfil:", data);
          setPerfil(data);
        } else if (response.status === 401) {
          console.log("🔒 Token inválido o expirado");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.push("/iniciar-sesion");
        } else {
          // Mejor mensaje de error
          const errorText = await response.text();
          console.error("❌ Error response:", errorText);
          throw new Error(`Error ${response.status}: ${errorText}`);
        }
      } catch (error) {
        console.error("💥 Error completo:", error);
        setError("No se pudo cargar el perfil. Verifica la consola para más detalles.");
      } finally {
        setCargando(false);
      }
    };

    cargarPerfil();
  }, [router]);

  // ... (el resto de tu código de perfil se mantiene igual)
  const formatearFecha = (fecha?: string) => {
    if (!fecha) return "No especificada";
    return new Date(fecha).toLocaleDateString('es-ES');
  };

  if (cargando) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Cargando tu perfil...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-6 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error al cargar el perfil</p>
          <p className="mt-2">{error}</p>
          <div className="mt-4 space-y-2">
            <button 
              onClick={() => router.push("/iniciar-sesion")}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 mr-2"
            >
              Iniciar Sesión
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mi Perfil</h1>
        <div className="flex gap-3">
          <Link
            href="/editar-perfil"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Editar Perfil
          </Link>
          <Link
            href="/"
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Nombre completo</label>
              <p className="mt-1 text-lg text-gray-900">
                {perfil?.name || "No especificado"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Email</label>
              <p className="mt-1 text-lg text-gray-900">{perfil?.email}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Teléfono</label>
              <p className="mt-1 text-lg text-gray-900">
                {perfil?.phone || "No especificado"}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">Dirección</label>
              <p className="mt-1 text-lg text-gray-900">
                {perfil?.address || "No especificada"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">Fecha de nacimiento</label>
              <p className="mt-1 text-lg text-gray-900">
                {formatearFecha(perfil?.birthDate)}
              </p>
            </div>

            {perfil?.createdAt && (
              <div>
                <label className="block text-sm font-medium text-gray-600">Miembro desde</label>
                <p className="mt-1 text-lg text-gray-900">
                  {formatearFecha(perfil.createdAt)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/mis-pedidos"
          className="bg-yellow-500 text-black px-6 py-3 rounded-lg text-center hover:bg-yellow-600 transition-colors"
        >
          📦 Ver Mis Pedidos
        </Link>
        
        <Link
          href="/productos"
          className="bg-green-500 text-white px-6 py-3 rounded-lg text-center hover:bg-green-600 transition-colors"
        >
          🛍️ Seguir Comprando
        </Link>
      </div>
    </div>
  );
}