'use client';
import { useState } from 'react';

export default function RegisterPage() {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(form)
    });
    // Manejar respuesta
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" onChange={(e) => setForm({...form, email: e.target.value})} />
      <input type="password" onChange={(e) => setForm({...form, password: e.target.value})} />
      <button type="submit">Registrarse</button>
    </form>
  );
}