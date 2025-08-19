'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useUser } from "../components/Navbar"; // Ajusta según la ubicación real

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useUser(); // Contexto de usuario

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; // <- variable de entorno
  console.log("API Base URL:", API_BASE_URL);

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
      const response = await fetch(`${API_BASE_URL}/users`, { // <- URL dinámica
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje("✅ Registro exitoso. Iniciando sesión automáticamente...");
        setEmail("");
        setPassword("");
        setName("");

        // Guardar usuario en el contexto y localStorage
        login({ name: data.user.name, email: data.user.email });

        // Redirigir al home
        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setMensaje(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setMensaje("❌ Error al conectar con el backend");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Registrar Usuario</h1>
      <form onSubmit={registrarUsuario} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </span>
        </div>
        <div className="text-sm space-y-1">
          <p className={hasUppercase ? "text-green-600" : "text-red-600"}>✔️ Al menos una mayúscula</p>
          <p className={hasNumber ? "text-green-600" : "text-red-600"}>✔️ Al menos un número</p>
          <p className={hasSpecial ? "text-green-600" : "text-red-600"}>✔️ Al menos un carácter especial</p>
          <p className={hasMinLength ? "text-green-600" : "text-red-600"}>✔️ Al menos 8 caracteres</p>
        </div>
        <button
          type="submit"
          className="py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Registrarse
        </button>
      </form>
      {mensaje && <p className="mt-4 text-center">{mensaje}</p>}
    </div>
  );
}