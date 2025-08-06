const customLabels: Record<string, string> = {
  'running': 'Running',
  'zapatillas': 'Zapatillas Deportivas',
  // Agrega más mapeos según necesites
};

// Dentro del map:
const label = customLabels[path] || 
              categoryNames[path] || 
              path.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());