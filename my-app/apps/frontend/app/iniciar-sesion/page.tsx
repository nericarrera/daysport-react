"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  const loginUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    // Validación rápida
    if (!email.includes("@") || password.length === 0) {
      setMensaje("❌ Ingresa un email válido y tu contraseña.");
      return;
    }

    try {
      const response = await fetch("http://192.168.1.34:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Login exitoso");
        // Guardar token en localStorage o cookie
        localStorage.setItem("token", data.token);
        // Redirigir a página de usuario o dashboard
        router.push("/dashboard");
      } else {
        setMensaje(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error en login:", error);
      setMensaje("❌ Error al conectar con el backend");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h1>Login</h1>
      <form onSubmit={loginUsuario} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
        <button type="submit" style={{ padding: "10px", borderRadius: "5px", backgroundColor: "#1d4ed8", color: "#fff", border: "none", cursor: "pointer" }}>
          Ingresar
        </button>
      </form>
      {mensaje && <p style={{ marginTop: "15px" }}>{mensaje}</p>}
    </div>
  );
}
