import type { CollectionConfig } from 'payload'
import { editors, publishedOrLoggedIn } from '../access'

/**
 * An Edition is one issue of the magazine (e.g. "Spring 2026"). It owns metadata
 * and a cover, and groups a set of Pages. The front-end renders an edition as a
 * micro-site at /editions/[slug].
 */
export const Editions: CollectionConfig = {
  slug: 'editions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'issueNumber', 'publishDate', '_status'],
    group: 'Magazine',
  },
  access: {
    read: publishedOrLoggedIn,
    create: editors,
    update: editors,
    delete: editors,
  },
  versions: {
    drafts: { autosave: true },
    maxPerDoc: 25,
  },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'URL: /editions/<slug>' },
    },
    {
      type: 'row',
      fields: [
        { name: 'issueNumber', type: 'number', admin: { width: '50%' } },
        {
          name: 'publishDate',
          type: 'date',
          admin: { width: '50%', date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    { name: 'tagline', type: 'textarea' },
    { name: 'cover', type: 'upload', relationTo: 'media' },
    {
      name: 'theme',
      type: 'group',
      admin: { description: 'Shared look applied across this edition.' },
      fields: [
        { name: 'accentColor', type: 'text', admin: { description: 'e.g. #C2410C' } },
        {
          name: 'decor',
          type: 'relationship',
          relationTo: 'decor',
          hasMany: true,
          admin: { description: 'Decor pulled from the shared catalog.' },
        },
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
