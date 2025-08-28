const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      }
    ];
  },
  images: {
    // ✅ CONFIGURACIÓN MÁS PERMISIVA
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**', // ← PERMITE TODAS LAS RUTAS
      }
    ],
    unoptimized: true, // ← DESACTIVA OPCIÓN DE OPTIMIZACIÓN
  },
};

module.exports = nextConfig;