"export async function testConnection() {}
  try 
    const res = await fetch('/api/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: '{ __typename }' })
    return await res.json()
  } catch (error) {
    console.error('Error de conexión:', error)
    return { error: 'No se pudo conectar al backend' }
  }
}"