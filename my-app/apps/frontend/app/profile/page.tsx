"use client";

import { useState, useEffect } from "react";
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
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (!storedToken) {
      router.push("/(auth)/login");
      return;
    }

    setToken(storedToken);

    // Definimos la función dentro del useEffect
    const cargarPerfil = async () => {
      try {
        const res = await fetch("http://192.168.1.34:3001/users/profile", {
          headers: { "Authorization": `Bearer ${storedToken}` },
        });

        if (res.ok) {
          const data = await res.json();
          setPerfil(data);
        } else {
          const errorData = await res.json();
          setMensaje(`❌ Error al obtener perfil: ${errorData.message}`);
          localStorage.removeItem("token");
          router.push("/(auth)/login");
        }
      } catch (error) {
        console.error("Error al obtener perfil:", error);
        setMensaje("❌ Error al conectar con el backend");
        localStorage.removeItem("token");
        router.push("/(auth)/login");
      }
    };

    cargarPerfil();
  }, [router]);

  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.push("/(auth)/login");
  };

  if (!token) return null; // Evita renderizar mientras redirige

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h1>Perfil del Usuario</h1>

      <button
        onClick={cerrarSesion}
        style={{ marginBottom: "15px", padding: "10px", borderRadius: "5px", backgroundColor: "#dc2626", color: "#fff", border: "none", cursor: "pointer" }}
      >
        Cerrar sesión
      </button>

      {mensaje && <p>{mensaje}</p>}

      {perfil ? (
        <div>
          <p><strong>ID:</strong> {perfil.id}</p>
          <p><strong>Email:</strong> {perfil.email}</p>
          <p><strong>Nombre:</strong> {perfil.name || "No definido"}</p>
          <p><strong>Teléfono:</strong> {perfil.phone || "No definido"}</p>
          <p><strong>Dirección:</strong> {perfil.address || "No definido"}</p>
          <p><strong>Fecha de nacimiento:</strong> {perfil.birthDate || "No definido"}</p>
          <p><strong>Creado el:</strong> {new Date(perfil.createdAt).toLocaleString()}</p>
        </div>
      ) : (
        <p>Cargando perfil...</p>
      )}
    </div>
  );
}