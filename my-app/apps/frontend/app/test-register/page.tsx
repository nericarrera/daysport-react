"use client";

export default function TestRegisterPage() {
  async function registrarUsuario() {
    try {
      const response = await fetch("http://192.168.1.34:3001/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test2@example.com",
          password: "123456",
        }),
      });

      const data = await response.json();
      console.log("Respuesta del backend:", data);
      alert("Registro completado: " + JSON.stringify(data));
    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error al registrar");
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Registro</h1>
      <button onClick={registrarUsuario}>Probar registro</button>
    </div>
  );
}