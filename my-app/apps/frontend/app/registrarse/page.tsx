"use client";

import { useState } from "react";

export default function RegistrarsePage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");

  const registrarUsuario = async (e: React.FormEvent) => {
    e.preventDefault(); // evita que la página recargue
    setMensaje("");

    try {
  const response = await fetch("http://192.168.1.34:3001/auth/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    email: email,       // obligatorio
    password: password, // obligatorio
    name: null, // opcional, si tu backend lo acepta
  }),
});

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Usuario registrado correctamente: " + data.user.email);
        setEmail("");
        setPassword("");
      } else {
        setMensaje("❌ Error: " + data.message);
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      setMensaje("❌ Error al conectar con el backend");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h1>Registrarse</h1>
      <form onSubmit={registrarUsuario} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
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
          Crear cuenta
        </button>
      </form>
      {mensaje && <p style={{ marginTop: "15px" }}>{mensaje}</p>}
    </div>
  );
}