'use client';

import { useState } from 'react';

export default function RegistrarsePage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setMensaje('');

    try {
      const res = await fetch('http://localhost:3001/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMensaje('✅ Usuario registrado con éxito!');
        setEmail('');
        setPassword('');
      } else {
        setMensaje('❌ ' + (data.message || 'Error en el registro'));
      }
    } catch (error) {
      console.error(error); 
      setMensaje('❌ Error de conexión al backend');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', textAlign: 'center' }}>
      <h1>Registrarse</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={cargando}>
          {cargando ? 'Registrando...' : 'Registrarse'}
        </button>
      </form>
      {mensaje && <p style={{ marginTop: '10px' }}>{mensaje}</p>}
    </div>
  );
}