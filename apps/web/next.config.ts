import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: process.env.DOCKER_BUILD === 'true' ? 'standalone' : undefined,
    cacheComponents: true,
    transpilePackages: ['@smart-bookmark/shared'],
};

export default nextConfig;
