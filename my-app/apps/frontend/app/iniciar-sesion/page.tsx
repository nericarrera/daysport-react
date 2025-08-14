"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");

    try {
      const response = await fetch("http://192.168.1.34:3001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Inicio de sesión exitoso. Redirigiendo...");
        setTimeout(() => {
          router.push("/"); // Redirigir al home o dashboard
        }, 1500);
      } else {
        setMensaje(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setMensaje("❌ Error al conectar con el backend");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Contraseña con ojo */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
          />
          <span
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-blue-500 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </span>
        </div>

        <button
          type="submit"
          className="py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Iniciar Sesión
        </button>
      </form>

      <p className="mt-4 text-center">
        ¿No tenés cuenta?{" "}
        <a
          href="/auth/registrarse"
          className="text-blue-600 hover:underline"
        >
          Registrate aquí
        </a>
      </p>

      {mensaje && <p className="mt-4 text-center">{mensaje}</p>}
    </div>
  );
}