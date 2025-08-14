"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false); // <-- estado para el ojito
  const router = useRouter();

  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+{}[\]:;<>,.?/~\-]/.test(password);
  const hasMinLength = password.length >= 8;

  const validarPassword = () => hasUppercase && hasNumber && hasSpecial && hasMinLength;

  const registrarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (!validarPassword()) {
      setMensaje("❌ La contraseña no cumple con los requisitos.");
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
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ccc" }}
        />

        {/* Input de contraseña con ojito */}
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: "8px 35px 8px 8px", borderRadius: "5px", border: "1px solid #ccc", width: "100%" }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "8px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              fontSize: "16px",
              color: "#555"
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {/* Validación visual */}
        <div style={{ fontSize: "14px", marginBottom: "10px" }}>
          <p style={{ color: hasUppercase ? "green" : "red" }}>✔️ Al menos una mayúscula</p>
          <p style={{ color: hasNumber ? "green" : "red" }}>✔️ Al menos un número</p>
          <p style={{ color: hasSpecial ? "green" : "red" }}>✔️ Al menos un carácter especial</p>
          <p style={{ color: hasMinLength ? "green" : "red" }}>✔️ Al menos 8 caracteres</p>
        </div>

        <button
          type="submit"
          style={{ padding: "10px", borderRadius: "5px", backgroundColor: "#1d4ed8", color: "#fff", border: "none", cursor: "pointer" }}
        >
          Registrarse
        </button>
      </form>
      {mensaje && <p style={{ marginTop: "15px" }}>{mensaje}</p>}
    </div>
  );
}