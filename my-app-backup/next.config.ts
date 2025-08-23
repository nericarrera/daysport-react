const nextConfig = {
  images: {
    domains: ['picsum.photos'], // ← Agrega este dominio
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
