'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../components/Navbar"; // Ajusta la ruta según donde esté tu Navbar

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser(); // Contexto de usuario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // <- variable de entorno
  console.log("API Base URL:", API_BASE_URL);

  const iniciarSesion = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    if (!email || !password) {
      setMensaje("❌ Por favor completa todos los campos.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, { // <- URL dinámica
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Inicio de sesión exitoso. Redirigiendo...");

        // Guardar usuario en el contexto y en localStorage automáticamente
        login({ name: data.user.name, email: data.user.email });

        setTimeout(() => {
          router.push("/"); // Redirige a la página principal
        }, 1000);
      } else {
        setMensaje(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMensaje("❌ Error al conectar con el servidor.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
      }}
    >
      <h1>Iniciar Sesión</h1>
      <form
        onSubmit={iniciarSesion}
        style={{ display: "flex", flexDirection: "column", gap: "10px" }}
      >
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: "8px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "8px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              width: "100%",
            }}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: "absolute",
              right: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              cursor: "pointer",
              color: "#555",
              fontSize: "14px",
            }}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>
        <button
          type="submit"
          style={{
            padding: "10px",
            borderRadius: "5px",
            backgroundColor: "#1d4ed8",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          Iniciar Sesión
        </button>
      </form>
      {mensaje && <p style={{ marginTop: "15px" }}>{mensaje}</p>}
    </div>
  );
}