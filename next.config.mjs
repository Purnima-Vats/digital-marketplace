/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "utfs.io",
                port: "",
                pathname: "/**",
            },
        ],
    },
    eslint: {ignoreDuringBuilds: true},
};

export default nextConfig;
