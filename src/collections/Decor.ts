import type { CollectionConfig } from 'payload'
import { editors, publishedOrLoggedIn } from '../access'

/**
 * Shared "decor" catalog — reusable styling/props/elements that editions draw
 * from. Defined once here, referenced from any page via the DecorShowcase block
 * or directly from an Edition. Single source of truth across all editions.
 */
export const Decor: CollectionConfig = {
  slug: 'decor',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'updatedAt'],
    group: 'Library',
  },
  access: {
    read: publishedOrLoggedIn,
    create: editors,
    update: editors,
    delete: editors,
  },
  versions: { drafts: true },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'category',
      type: 'select',
      options: [
        { label: 'Color palette', value: 'palette' },
        { label: 'Pattern', value: 'pattern' },
        { label: 'Prop / Object', value: 'prop' },
        { label: 'Typography set', value: 'type' },
        { label: 'Texture', value: 'texture' },
      ],
    },
    { name: 'image', type: 'upload', relationTo: 'media' },
    { name: 'description', type: 'textarea' },
    {
      name: 'swatches',
      type: 'array',
      admin: { description: 'Optional color swatches for palette decor.' },
      fields: [{ name: 'hex', type: 'text', required: true }],
    },
  ],
}
