export async function fetchProtectedData() {
  const token = localStorage.getItem('token');
  if (!token) throw new Error('No autenticado');

  const res = await fetch('http://localhost:3001/protected-route', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error('Error al obtener datos');

  return await res.json();
}