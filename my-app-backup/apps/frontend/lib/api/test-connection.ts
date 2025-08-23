export async function testBackendConnection() {
  try {
    const res = await fetch('http://localhost:3001/api/test', {
      method: 'GET',
    });

    if (!res.ok) {
      throw new Error(`Error HTTP: ${res.status}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error conectando al backend:', error);
    return null;
  }
}