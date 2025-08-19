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

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001";
  console.log("API Base URL:", API_BASE_URL);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/iniciar-sesion");
      return;
    }

    const cargarPerfil = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Manejo seguro de JSON
        const data = await res.json().catch(() => ({}));

        if (res.ok) {
          setPerfil(data);
        } else {
          setMensaje(`❌ Error al cargar perfil: ${data.message || "Inicia sesión nuevamente"}`);
          localStorage.removeItem("token");
          setTimeout(() => router.push("/iniciar-sesion"), 1500);
        }
      } catch (error) {
        console.error("Error al conectar con el backend:", error);
        setMensaje("❌ Error al conectar con el backend. Revisa tu conexión.");
      }
    };

    cargarPerfil();
  }, [router, API_BASE_URL]);

  if (!perfil) return <p>{mensaje || "Cargando perfil..."}</p>;

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h1>Perfil del usuario</h1>
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