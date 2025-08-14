"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  const validarPassword = (pass: string) => {
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}[\]:;<>,.?/~\-]).{8,}$/;
    return regex.test(pass);
  };

  const registrarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (!validarPassword(password)) {
      setMensaje(
        "❌ La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial."
      );
      return;
    }

    try {
      const response = await fetch("http://192.168.1.34:3001/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Usuario registrado correctamente. Redirigiendo al login...");
        setEmail("");
        setPassword("");
        setName("");

        // Redirigir a login después de 2 segundos
        setTimeout(() => {
          router.push("/auth/login");
        }, 2000);
      } else {
        setMensaje(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setMensaje("❌ Error al conectar con el backend");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h1>Registrar Usuario</h1>
      <form onSubmit={registrarUsuario} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
        <input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }} />
        <button type="submit" style={{ padding: "10px", borderRadius: "5px", backgroundColor: "#1d4ed8", color: "#fff", border: "none", cursor: "pointer" }}>
          Registrarse
        </button>
      </form>
      {mensaje && <p style={{ marginTop: "15px" }}>{mensaje}</p>}
    </div>
  );
}