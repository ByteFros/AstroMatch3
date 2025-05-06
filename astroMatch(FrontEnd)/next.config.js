/** @type {import('next').NextConfig} */
const nextConfig = {

    images: {
      domains: ["localhost"], // Permite cargar imágenes desde localhost
      remotePatterns: [
        {
          protocol: "http",
          hostname: "localhost",
          port: "8080",
          pathname: "/uploads/**", // Permite imágenes dentro de /uploads/
        },
      ],
    },
  };
  
  module.exports = nextConfig;
  