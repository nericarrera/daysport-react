/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para evitar errores de TypeScript en desarrollo
  typescript: {
    // Ignora errores de TypeScript durante el build - ÚTIL PARA DESARROLLO
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
    // Pero muestra warnings para que no los ignores completamente
    tsconfigPath: './tsconfig.json',
  },
  
  // Configuración experimental para mejorar el manejo de rutas
  experimental: {
    // Mejora el rendimiento de la compilación
    optimizePackageImports: ['@heroicons/react'],
    // Habilita características modernas de React
    reactCompiler: false, // Puedes cambiar a true si usas React 19
  },

  // Configuración del compilador - MOVIDO AQUÍ
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Rewrites para tu API
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/api/:path*',
      },
      // Rewrite adicional para assets si es necesario
      {
        source: '/assets/:path*',
        destination: 'http://localhost:3001/assets/:path*',
      }
    ];
  },

  // Configuración de imágenes
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
      },
      // Agregar más dominios si es necesario
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      }
    ],
    // Optimización de imágenes - CONFIGURADO CORRECTAMENTE
    unoptimized: process.env.NODE_ENV === 'development',
    // Formatos modernos
    formats: ['image/webp', 'image/avif'],
    // Tamaños de imagen optimizados
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Headers de seguridad
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ],
      }
    ];
  },

  // Configuración de logging para desarrollo
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV === 'development',
    },
  },

  // Compresión y optimizaciones
  compress: true,
  poweredByHeader: false,

  // Configuración para entornos
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY || 'default_value',
  },

  // Redirecciones si las necesitas
  async redirects() {
    return [
      {
        source: '/old-favoritos',
        destination: '/favoritos',
        permanent: true,
      }
    ];
  }
};

// Configuración específica para producción - SOLO IMÁGENES
if (process.env.NODE_ENV === 'production') {
  nextConfig.images.unoptimized = false;
}

module.exports = nextConfig;