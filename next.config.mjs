/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone"
    // async rewrites() {
    //     return [
    //         {
    //             source: '/api/:path*',
    //             destination: 'http://localhost:5294/api/:path*',
    //         },
    //     ]
    // },
};

export default nextConfig;
