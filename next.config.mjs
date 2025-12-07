/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // Use remotePatterns for externally-hosted images (recommended)
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'api.dicebear.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
