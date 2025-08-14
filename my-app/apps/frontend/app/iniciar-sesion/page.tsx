"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function IniciarSesionPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const loginUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    try {
      const response = await fetch("http://192.168.1.34:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardamos el token en localStorage
        localStorage.setItem("token", data.token);

        setMensaje("✅ Inicio de sesión correcto, redirigiendo...");
        setEmail("");
        setPassword("");

        // Redirigimos automáticamente al perfil
        router.push("/perfil");
      } else {
        setMensaje("❌ Usuario o contraseña incorrecta");
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ flex: 1, padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ marginLeft: "5px", padding: "5px", cursor: "pointer" }}
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
        </div>
        <button type="submit" style={{ padding: "10px", borderRadius: "5px", backgroundColor: "#1d4ed8", color: "#fff", border: "none", cursor: "pointer" }}>
          Iniciar sesión
        </button>
      </form>

      {mensaje && <p style={{ marginTop: "15px" }}>{mensaje}</p>}
    </div>
  );
}