const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*', // Todas las rutas que empiecen con /api
        destination: 'http://localhost:3001/api/:path*', // Redirige al backend
      },
    ];
  },
  images: {
    domains: ['localhost'],
    // Para imágenes locales
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

module.exports = nextConfig;