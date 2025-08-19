'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "../components/Navbar";
import { apiAuth } from "../../utils/api";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useUser();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const iniciarSesion = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensaje("");
    setIsLoading(true);

    if (!formData.email || !formData.password) {
      setMensaje("❌ Por favor completa todos los campos.");
      setIsLoading(false);
      return;
    }

    try {
      const data = await apiAuth.login(formData);

      setMensaje("✅ Inicio de sesión exitoso. Redirigiendo...");

      // Guardar usuario en el contexto
      login({ 
        name: data.user?.name || formData.email.split('@')[0], 
        email: data.user?.email || formData.email 
      });

      // Guardar token si viene en la respuesta
      if (data.access_token) {
        localStorage.setItem("token", data.access_token);
      }

      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error: unknown) {
      console.error("Error al iniciar sesión:", error);
      
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
      <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
      
      <form onSubmit={iniciarSesion} className="flex flex-col gap-4">
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
            {showPassword ? "🙈" : "👁️"}
          </span>
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
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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
        <p>¿No tienes cuenta? </p>
        <button
          onClick={() => router.push('/registrarse')}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Regístrate aquí
        </button>
      </div>

      <div className="mt-4 text-center">
        <button
          onClick={() => router.push('/recuperar-contrasena')}
          className="text-sm text-gray-600 hover:text-gray-800 underline"
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>
    </div>
  );
}