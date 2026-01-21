import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // 配置 Turbopack 根目录，消除 workspace root warning
  experimental: {
    turbo: {
      root: __dirname,
    },
  },

  // 配置图片优化域名
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // 配置环境变量
  env: {
    NEXT_PUBLIC_APP_NAME: 'YYC³ 智能守护系统',
    NEXT_PUBLIC_APP_VERSION: '2.0.0',
  },

  // 配置Turbopack
  turbopack: {},
};

export default nextConfig;
