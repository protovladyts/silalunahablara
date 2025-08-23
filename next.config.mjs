/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para mejorar la hidratación
  experimental: {
    // Mejorar el manejo de la hidratación
    optimizePackageImports: ['framer-motion'],
  },
  
  // Configuración de compilación
  compiler: {
    // Eliminar console.log en producción
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Configuración de imágenes
  images: {
    // Permitir dominios externos si es necesario
    domains: [],
  },
  
  // Configuración de webpack
  webpack: (config, { dev, isServer }) => {
    // Optimizaciones para desarrollo
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      }
    }
    
    return config
  },
}

export default nextConfig
