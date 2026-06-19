import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js config here
  images: {
    remotePatterns: [
      // Allow serving media from a Vercel Blob / S3 origin in production.
      // Add your storage host here, e.g. { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }
    ],
  },
}

// withPayload wires Payload's admin + API into the Next.js build.
// devBundleServerPackages: false avoids bundling server-only deps during `next dev`.
export default withPayload(nextConfig, { devBundleServerPackages: false })
