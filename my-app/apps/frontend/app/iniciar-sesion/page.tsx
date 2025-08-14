"use client";

import { useState } from "react";

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
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [token, setToken] = useState("");
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);

  // Formulario de login
  const loginUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setToken("");
    setPerfil(null);

    try {
      const response = await fetch("http://192.168.1.34:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje(`✅ Inicio de sesión correcto: ${email}`);
        setToken(data.token);
        setEmail("");
        setPassword("");

        // Traemos perfil
        const perfilRes = await fetch("http://192.168.1.34:3001/users/profile", {
          headers: { Authorization: `Bearer ${data.token}` },
        });

        if (perfilRes.ok) {
          const perfilData = await perfilRes.json();
          setPerfil(perfilData);
        } else {
          const errorData = await perfilRes.json();
          setMensaje(`❌ Error al obtener perfil: ${errorData.message}`);
        }
      } else {
        setMensaje(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMensaje("❌ Error al conectar con el backend");
    }
  };

  // Guardar cambios en el perfil
  const actualizarPerfil = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setMensaje("");

    try {
      const response = await fetch("http://192.168.1.34:3001/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: perfil?.name,
          phone: perfil?.phone,
          address: perfil?.address,
          birthDate: perfil?.birthDate,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPerfil(data);
        setMensaje("✅ Perfil actualizado correctamente");
      } else {
        setMensaje(`❌ Error al actualizar perfil: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      setMensaje("❌ Error al conectar con el backend");
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      {!token && (
        <>
          <h1>Iniciar Sesión</h1>
          <form onSubmit={loginUsuario} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
            />
            <button type="submit" style={{ padding: "10px", borderRadius: "5px", backgroundColor: "#1d4ed8", color: "#fff", border: "none", cursor: "pointer" }}>
              Iniciar sesión
            </button>
          </form>
        </>
      )}

      {mensaje && <p style={{ marginTop: "15px" }}>{mensaje}</p>}

      {token && perfil && (
        <form onSubmit={actualizarPerfil} style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <h2>Editar Perfil</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={perfil.name || ""}
            onChange={(e) => setPerfil({ ...perfil, name: e.target.value })}
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <input
            type="text"
            placeholder="Teléfono"
            value={perfil.phone || ""}
            onChange={(e) => setPerfil({ ...perfil, phone: e.target.value })}
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <input
            type="text"
            placeholder="Dirección"
            value={perfil.address || ""}
            onChange={(e) => setPerfil({ ...perfil, address: e.target.value })}
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <input
            type="date"
            placeholder="Fecha de nacimiento"
            value={perfil.birthDate || ""}
            onChange={(e) => setPerfil({ ...perfil, birthDate: e.target.value })}
            style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <button type="submit" style={{ padding: "10px", borderRadius: "5px", backgroundColor: "#059669", color: "#fff", border: "none", cursor: "pointer" }}>
            Guardar Cambios
          </button>
        </form>
      )}
    </div>
  );
}