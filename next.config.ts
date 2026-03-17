import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    /* config options here */
    transpilePackages: ['lwc-plugin-pracplugin'],
    images: {
        domains: ['cdn.jsdelivr.net'],
    },
};

export default nextConfig;
