const nextConfig = {

    async redirects(){
        return [
            {
                source:"/",
                destination:"/dashboard",
                permanent: true,
            }
        ];
    },


    eslint: {
        // Warning: This allows production builds to successfully complete even if
        // your project has ESLint errors.
        ignoreDuringBuilds: true,
      },
   reactStrictMode: false,
   images: {
    domains: ['www.lpu.in','files.lpu.in'], // Add external domain here
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  
};

export default nextConfig;
