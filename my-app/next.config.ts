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
    // Dominios permitidos (forma alternativa)
    domains: ['localhost', 'images.unsplash.com'],
    
    // Patrones remotos más específicos
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/assets/images/**', // Más específico
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      }
    ],
    
    // Desactiva optimización en desarrollo para mejor debug
    unoptimized: process.env.NODE_ENV === 'development',
    
    // Formatos permitidos
    formats: ['image/webp', 'image/avif'],
    
    // Tamaños de imagen
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Agrega logging para debug
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;