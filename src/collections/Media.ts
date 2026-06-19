import type { CollectionConfig } from 'payload'
import { anyone, editors } from '../access'

export const Media: CollectionConfig = {
  slug: 'media',
  admin: {
    group: 'Library',
  },
  access: {
    read: anyone, // media is served publicly on the front-end
    create: editors,
    update: editors,
    delete: editors,
  },
  upload: {
    // On Vercel the runtime filesystem is read-only, so for production swap this
    // for a storage adapter (Vercel Blob / S3). Locally, files land in /media.
    staticDir: 'media',
    mimeTypes: ['image/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card', width: 768, height: 1024, position: 'centre' },
      { name: 'feature', width: 1600, height: undefined, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describe the image for accessibility and SEO.' },
    },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Photographer / source credit (optional).' },
    },
  ],
}
