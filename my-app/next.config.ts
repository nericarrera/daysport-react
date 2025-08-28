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
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/assets/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      }
    ],
    // Solo desactiva optimización en desarrollo
    unoptimized: process.env.NODE_ENV === 'development',
  },
  
  // Para producción, considera usar HTTPS o un CDN
};

module.exports = nextConfig;