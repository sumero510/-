/** @type {import('next').NextConfig} */

// GitHub Pages 向けの静的エクスポート時のみ STATIC_EXPORT=true をセット
// Vercel など通常デプロイではこの変数を設定しない
const isStaticExport = process.env.STATIC_EXPORT === 'true'

const nextConfig = {
  reactStrictMode: true,
  ...(isStaticExport && {
    output: 'export',
    trailingSlash: true,
  }),
  // GitHub Pages のサブパス設定（通常デプロイ時は空文字）
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
