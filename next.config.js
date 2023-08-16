/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    devIndicators: {
        buildActivityPosition: 'bottom-right',
    },
    experimental: {
        // serverActions: true
    },
    images: {
        // domains: ['localhost'], // domains: ["cdn.pixabay.com", "dog.ceo"]
        // deviceSizes: [450, 600, 640, 750, 768, 828, 1024, 1080, 1200, 1280, 1536, 1920, 2048, 3840],
    }
}

module.exports = nextConfig
