import type { Block } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

/**
 * Reusable content blocks. Pages are assembled from these in any order, so the
 * editorial team can lay out an edition without a developer. Add a new block
 * here and it instantly appears in the page builder.
 */

export const Hero: Block = {
  slug: 'hero',
  labels: { singular: 'Hero', plural: 'Heroes' },
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text', required: true },
    { name: 'subheading', type: 'textarea' },
    { name: 'image', type: 'upload', relationTo: 'media' },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'centered',
      options: [
        { label: 'Centered', value: 'centered' },
        { label: 'Image left', value: 'imageLeft' },
        { label: 'Full bleed', value: 'fullBleed' },
      ],
    },
  ],
}

export const RichText: Block = {
  slug: 'richText',
  labels: { singular: 'Rich Text', plural: 'Rich Text' },
  fields: [
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
      required: true,
    },
  ],
}

export const ImageFeature: Block = {
  slug: 'imageFeature',
  labels: { singular: 'Image Feature', plural: 'Image Features' },
  fields: [
    { name: 'image', type: 'upload', relationTo: 'media', required: true },
    { name: 'caption', type: 'text' },
    {
      name: 'size',
      type: 'select',
      defaultValue: 'wide',
      options: [
        { label: 'Inline', value: 'inline' },
        { label: 'Wide', value: 'wide' },
        { label: 'Full bleed', value: 'fullBleed' },
      ],
    },
  ],
}

export const Gallery: Block = {
  slug: 'gallery',
  labels: { singular: 'Gallery', plural: 'Galleries' },
  fields: [
    {
      name: 'images',
      type: 'array',
      minRows: 2,
      fields: [
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'caption', type: 'text' },
      ],
    },
    {
      name: 'columns',
      type: 'select',
      defaultValue: '3',
      options: ['2', '3', '4'].map((v) => ({ label: `${v} columns`, value: v })),
    },
  ],
}

export const Quote: Block = {
  slug: 'quote',
  labels: { singular: 'Pull Quote', plural: 'Pull Quotes' },
  fields: [
    { name: 'quote', type: 'textarea', required: true },
    { name: 'attribution', type: 'text' },
  ],
}

/**
 * DecorShowcase pulls items from the shared Decor catalog rather than
 * re-entering them. This is the "reusable decor" requirement: one source of
 * truth, referenced across many editions/pages.
 */
export const DecorShowcase: Block = {
  slug: 'decorShowcase',
  labels: { singular: 'Decor Showcase', plural: 'Decor Showcases' },
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'items',
      type: 'relationship',
      relationTo: 'decor',
      hasMany: true,
      required: true,
      admin: { description: 'Pick items from the shared decor catalog.' },
    },
  ],
}

export const CallToAction: Block = {
  slug: 'cta',
  labels: { singular: 'Call To Action', plural: 'Calls To Action' },
  fields: [
    { name: 'heading', type: 'text', required: true },
    { name: 'body', type: 'textarea' },
    { name: 'buttonLabel', type: 'text' },
    { name: 'buttonHref', type: 'text' },
  ],
}

export const layoutBlocks: Block[] = [
  Hero,
  RichText,
  ImageFeature,
  Gallery,
  Quote,
  DecorShowcase,
  CallToAction,
]
