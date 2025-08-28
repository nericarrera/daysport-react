const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
      {
        source: '/products/:path*', 
        destination: 'http://localhost:3001/api/products/:path*',
      }
    ];
  },
  images: {
    remotePatterns: [
      // Para imágenes locales del backend
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
      },
      // Para imágenes de Unsplash (¡ESTA FALTA!)
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '.unsplash.com', // Para todos los subdominios
      },
    ],
  },
};

module.exports = nextConfig;