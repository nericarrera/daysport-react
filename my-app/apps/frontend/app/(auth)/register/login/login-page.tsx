'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // si usás Next.js

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok && data.token) {
      localStorage.setItem('token', data.token);
      setMessage('Login exitoso');
      // Redirigir a otra página, por ej. home o dashboard
      router.push('/shop');
    } else {
      setMessage(data.message || 'Credenciales inválidas');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Iniciar sesión</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Correo electrónico"
          className="w-full p-2 border rounded"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          className="w-full p-2 border rounded"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Iniciar sesión
        </button>
      </form>
      {message && <p className="mt-4 text-center text-red-600">{message}</p>}
    </div>
  );
}