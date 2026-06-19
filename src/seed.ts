import { getPayload } from 'payload'
import config from '@payload-config'

/**
 * Seeds a demo admin, a shared decor palette, one edition and two pages so the
 * front-end has something to render immediately. Run with: `pnpm seed`.
 * Idempotent-ish: skips creation if the admin user already exists.
 */
const run = async () => {
  const payload = await getPayload({ config })

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: 'admin@example.com' } },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    payload.logger.info('Seed already applied — admin@example.com exists. Skipping.')
    process.exit(0)
  }

  await payload.create({
    collection: 'users',
    data: {
      name: 'Demo Admin',
      email: 'admin@example.com',
      password: 'changeme123',
      role: 'admin',
    },
  })

  const palette = await payload.create({
    collection: 'decor',
    data: {
      name: 'Autumn Palette',
      slug: 'autumn-palette',
      category: 'palette',
      description: 'Warm earth tones used across the Spring 2026 edition.',
      _status: 'published',
      swatches: [{ hex: '#C2410C' }, { hex: '#1A1A1A' }, { hex: '#FAF8F5' }, { hex: '#6B6B6B' }],
    },
  })

  const edition = await payload.create({
    collection: 'editions',
    data: {
      title: 'Spring Awakening',
      slug: 'spring-awakening',
      issueNumber: 1,
      publishDate: new Date().toISOString(),
      tagline: 'A first look at the season ahead — design, craft, and colour.',
      featured: true,
      theme: { accentColor: '#C2410C', decor: [palette.id] },
      _status: 'published',
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Editor’s Letter',
      slug: 'editors-letter',
      edition: edition.id,
      order: 1,
      _status: 'published',
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Letter from the editor',
          heading: 'Welcome to the first edition',
          subheading: 'Everything you see here is assembled from reusable blocks in Payload.',
          layout: 'centered',
        },
        {
          blockType: 'quote',
          quote: 'Good design is as little design as possible — but never less than the story needs.',
          attribution: 'The Editors',
        },
      ],
    },
  })

  await payload.create({
    collection: 'pages',
    data: {
      title: 'The Colour Story',
      slug: 'the-colour-story',
      edition: edition.id,
      order: 2,
      _status: 'published',
      layout: [
        {
          blockType: 'hero',
          eyebrow: 'Feature',
          heading: 'A season in warm tones',
          layout: 'centered',
        },
        {
          blockType: 'decorShowcase',
          heading: 'From the shared decor catalog',
          items: [palette.id],
        },
        {
          blockType: 'cta',
          heading: 'Want the full edition?',
          body: 'Subscribe to get every new issue in your inbox.',
          buttonLabel: 'Subscribe',
          buttonHref: '#',
        },
      ],
    },
  })

  payload.logger.info('✅ Seed complete. Admin: admin@example.com / changeme123')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
