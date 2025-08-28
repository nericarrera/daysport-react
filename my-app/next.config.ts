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
    // PERMITE imágenes HTTP locales
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    
    // Configuración más permisiva
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**', // Permite TODAS las rutas
      }
    ],
    
    // Desactiva completamente la optimización
    unoptimized: true,
  },
};

module.exports = nextConfig;