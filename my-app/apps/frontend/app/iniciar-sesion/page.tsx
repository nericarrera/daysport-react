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

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [perfil, setPerfil] = useState<UsuarioPerfil | null>(null);
  const [mensaje, setMensaje] = useState("");

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
        setToken(data.token);
        setEmail("");
        setPassword("");

        // Traer perfil
        const perfilRes = await fetch("http://192.168.1.34:3001/users/profile", {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
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

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
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

      {mensaje && <p style={{ marginTop: "15px" }}>{mensaje}</p>}

      {token && (
        <div style={{ marginTop: "10px", wordBreak: "break-word" }}>
          <strong>Token JWT:</strong>
          <p>{token}</p>
        </div>
      )}

      {perfil && (
        <div style={{ marginTop: "15px" }}>
          <h3>Perfil del usuario:</h3>
          <p><strong>ID:</strong> {perfil.id}</p>
          <p><strong>Email:</strong> {perfil.email}</p>
          <p><strong>Nombre:</strong> {perfil.name || "No definido"}</p>
          <p><strong>Teléfono:</strong> {perfil.phone || "No definido"}</p>
          <p><strong>Dirección:</strong> {perfil.address || "No definido"}</p>
          <p><strong>Fecha de nacimiento:</strong> {perfil.birthDate || "No definido"}</p>
          <p><strong>Creado el:</strong> {new Date(perfil.createdAt).toLocaleString()}</p>
        </div>
      )}
    </div>
  );
}