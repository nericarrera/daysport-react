export async function testBackendConnection() {
  try {
    const res = await fetch('http://localhost:3001/auth/register', {
      method: 'GET',
    });
    if (!res.ok) {
      throw new Error(`Error: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Error conectando al backend:", err);
    return null;
  }
}