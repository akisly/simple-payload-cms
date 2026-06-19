import type { CollectionConfig } from 'payload'
import { editors, publishedOrLoggedIn } from '../access'
import { layoutBlocks } from '../blocks'

/**
 * A Page belongs to an Edition and is built from reusable layout blocks.
 * Order within an edition is controlled by `order`. URL: /editions/<edition>/<slug>.
 */
export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'edition', 'order', '_status'],
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
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'edition',
      type: 'relationship',
      relationTo: 'editions',
      required: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar', description: 'Sort order within the edition.' },
    },
    {
      name: 'layout',
      type: 'blocks',
      required: true,
      minRows: 1,
      blocks: layoutBlocks,
      admin: { description: 'Assemble the page from reusable blocks.' },
    },
    {
      name: 'seo',
      type: 'group',
      admin: { position: 'sidebar' },
      fields: [
        { name: 'metaTitle', type: 'text' },
        { name: 'metaDescription', type: 'textarea' },
      ],
    },
  ],
}
