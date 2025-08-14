"use client";

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
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  useEffect(() => {
    const cargarPerfil = async () => {
      // 1️⃣ Obtener token del localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/iniciar-sesion");
        return;
      }

      try {
        // 2️⃣ Hacer fetch al endpoint de perfil
        const response = await fetch("http://192.168.1.34:3001/users/profile", {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          setPerfil(data);
        } else {
          setMensaje(`❌ Error: ${data.message}`);
          // si el token no es válido, redirigir al login
          if (response.status === 401) router.push("/iniciar-sesion");
        }
      } catch (error) {
        console.error("Error al cargar perfil:", error);
        setMensaje("❌ Error al conectar con el backend");
      }
    };

    cargarPerfil();
  }, [router]);

  if (!perfil) {
    return <p>Cargando perfil...</p>;
  }

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h1>Perfil del Usuario</h1>
      {mensaje && <p>{mensaje}</p>}

      <p><strong>ID:</strong> {perfil.id}</p>
      <p><strong>Email:</strong> {perfil.email}</p>
      <p><strong>Nombre:</strong> {perfil.name || "No definido"}</p>
      <p><strong>Teléfono:</strong> {perfil.phone || "No definido"}</p>
      <p><strong>Dirección:</strong> {perfil.address || "No definido"}</p>
      <p><strong>Fecha de nacimiento:</strong> {perfil.birthDate || "No definido"}</p>
      <p><strong>Creado el:</strong> {new Date(perfil.createdAt).toLocaleString()}</p>
    </div>
  );
}