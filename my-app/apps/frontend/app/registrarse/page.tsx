'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useUser } from "../components/Navbar";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useUser();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const hasUppercase = /[A-Z]/.test(formData.password);
  const hasNumber = /\d/.test(formData.password);
  const hasSpecial = /[!@#$%^&*()_+{}[\]:;<>,.?/~\-]/.test(formData.password);
  const hasMinLength = formData.password.length >= 8;

  const validarPassword = () => hasUppercase && hasNumber && hasSpecial && hasMinLength;

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const registrarUsuario = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setIsLoading(true);

    if (!formData.email || !formData.password || !formData.name) {
      setMensaje("❌ Por favor completa todos los campos.");
      setIsLoading(false);
      return;
    }

    if (!validarPassword()) {
      setMensaje("❌ La contraseña no cumple con los requisitos.");
      setIsLoading(false);
      return;
    }

    try {
      // LLAMADA MODIFICADA: Usa la API Route de Next.js en lugar del backend directo
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      setMensaje("✅ Registro exitoso. Iniciando sesión automáticamente...");
      
      // Guardar usuario en el contexto
      login({ 
        name: data.user?.name || formData.name, 
        email: data.user?.email || formData.email 
      });

      // Guardar token si viene en la respuesta
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }

      // Limpiar formulario
      setFormData({ email: "", password: "", name: "" });

      // Redirigir al home
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: unknown) {
      console.error("Error al registrar usuario:", error);
      
      if (error instanceof Error) {
        setMensaje(`❌ ${error.message || "Error al conectar con el servidor"}`);
      } else {
        setMensaje("❌ Error desconocido al conectar con el servidor");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Registrar Usuario</h1>
      
      <form onSubmit={registrarUsuario} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Nombre completo"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          required
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        
        <input
          type="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            required
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            disabled={isLoading}
          />
          <span
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-600 hover:text-blue-500 transition-colors"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </span>
        </div>

        <div className="text-sm space-y-1 p-3 bg-gray-50 rounded">
          <p className={hasUppercase ? "text-green-600" : "text-red-600"}>
            {hasUppercase ? "✅" : "❌"} Al menos una mayúscula
          </p>
          <p className={hasNumber ? "text-green-600" : "text-red-600"}>
            {hasNumber ? "✅" : "❌"} Al menos un número
          </p>
          <p className={hasSpecial ? "text-green-600" : "text-red-600"}>
            {hasSpecial ? "✅" : "❌"} Al menos un carácter especial
          </p>
          <p className={hasMinLength ? "text-green-600" : "text-red-600"}>
            {hasMinLength ? "✅" : "❌"} Al menos 8 caracteres
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`py-2 text-white rounded transition-colors ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>

      {mensaje && (
        <div className={`mt-4 p-3 rounded text-center ${
          mensaje.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {mensaje}
        </div>
      )}

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>¿Ya tienes cuenta? </p>
        <button
          onClick={() => router.push('/iniciar-sesion')}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Iniciar sesión
        </button>
      </div>
    </div>
  );
}