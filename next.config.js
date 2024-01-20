const { config } = require('process')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = {
  nextConfig,
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  }, 
}