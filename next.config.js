/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  transpilePackages: ['@mui/material', '@mui/icons-material', 'react-toastify'],
  images: {
    disableStaticImages: true,
  },
  async redirects() {
    return [
      {
        source: '/businesstools',
        destination: 'https://businessbosses.news',
        permanent: true,
      },
      {
        source: '/news',
        destination: 'https://businessbosses.news',
        permanent: true,
      },
    ]
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            exportType: 'named',
            namedExport: 'ReactComponent',
          },
        },
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
            publicPath: '/_next/static/images/',
            outputPath: 'static/images/',
            name: '[name].[hash].[ext]',
            esModule: false,
          },
        },
      ],
    })

    config.module.rules.push({
      test: /\.(png|jpe?g|gif|webp|avif|jpeg)$/i,
      use: [
        {
          loader: 'url-loader',
          options: {
            limit: 8192,
            publicPath: '/_next/static/images/',
            outputPath: 'static/images/',
            name: '[name].[hash].[ext]',
            esModule: false,
          },
        },
      ],
    })

    return config
  },
}

module.exports = nextConfig
