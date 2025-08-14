"use client";

import { useEffect, useState } from "react";

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

  const cargarPerfil = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setMensaje("❌ No hay token guardado. Inicia sesión primero.");
      return;
    }

    try {
      const res = await fetch("http://192.168.1.34:3001/users/profile", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        setPerfil(data);
      } else {
        setMensaje(`❌ Error al cargar perfil: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      setMensaje("❌ Error al conectar con el backend");
    }
  };

  useEffect(() => {
    cargarPerfil();
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h1>Perfil del usuario</h1>

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
        !mensaje && <p>Cargando perfil...</p>
      )}
    </div>
  );
}