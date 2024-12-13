import remarkMath from 'remark-math'
import rehypeMathjax from 'rehype-mathjax'
import createMDX from '@next/mdx'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // swcMinify: false
  pageExtensions: ['md', 'mdx', 'ts', 'tsx'],
  reactStrictMode: true,
  images: {
    domains: ['localhost', '192.168.3.19'],
  },
  async headers() {
    return [
        {
            // matching all API routes
            source: "/api/:path*",
            headers: [
                { key: "Access-Control-Allow-Credentials", value: "true" },
                { key: "Access-Control-Allow-Origin", value: "*" }, // replace this your actual origin
                { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
            ]
        }
    ]
}
}

const withMDX = createMDX({
  // Add markdown plugins here, as desired
  options: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeMathjax],
  },
})

export default withMDX(nextConfig)