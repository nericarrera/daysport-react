'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface UsuarioPerfil {
  id: number;
  email: string;
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  birthDate?: string | null;
  createdAt: string;
}

export default function PerfilPage() {
  const router = useRouter();
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);
  const [mensaje, setMensaje] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMensaje("❌ No has iniciado sesión. Redirigiendo...");
      setTimeout(() => router.push("/iniciar-sesion"), 1500);
      return;
    }

    const cargarPerfil = async () => {
      try {
        setIsLoading(true);
        
        // LLAMADA MODIFICADA: Usa el API Route de Next.js
        const response = await fetch('/api/profile', {
          method: 'GET',
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setPerfil(data);
        
      } catch (error: unknown) {
        console.error("Error al cargar perfil:", error);
        
        if (error instanceof Error) {
          if (error.message.includes('401') || error.message.includes('403') || error.message.includes('Token')) {
            setMensaje("❌ Sesión expirada. Redirigiendo al login...");
            localStorage.removeItem("token");
            setTimeout(() => router.push("/iniciar-sesion"), 1500);
          } else {
            setMensaje(`❌ ${error.message || "Error al cargar el perfil"}`);
          }
        } else {
          setMensaje("❌ Error desconocido al cargar el perfil");
        }
      } finally {
        setIsLoading(false);
      }
    };

    cargarPerfil();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/iniciar-sesion");
  };

  if (isLoading) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 text-center">
        <p>Cargando perfil...</p>
      </div>
    );
  }

  if (!perfil) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 text-center">
        <p className="text-red-600">{mensaje}</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Perfil de Usuario</h1>
      
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="font-semibold">ID:</span>
          <span>{perfil.id}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-semibold">Email:</span>
          <span>{perfil.email}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-semibold">Nombre:</span>
          <span>{perfil.name || "No definido"}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-semibold">Teléfono:</span>
          <span>{perfil.phone || "No definido"}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-semibold">Dirección:</span>
          <span>{perfil.address || "No definido"}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-semibold">Fecha de nacimiento:</span>
          <span>{perfil.birthDate ? new Date(perfil.birthDate).toLocaleDateString() : "No definido"}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="font-semibold">Miembro desde:</span>
          <span>{new Date(perfil.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={() => router.push('/editar-perfil')}
          className="py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Editar Perfil
        </button>
        
        <button
          onClick={handleLogout}
          className="py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Cerrar Sesión
        </button>
      </div>

      {mensaje && (
        <div className={`mt-4 p-3 rounded text-center ${
          mensaje.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {mensaje}
        </div>
      )}
    </div>
  );
}