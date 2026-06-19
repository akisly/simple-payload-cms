import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayloadClient } from '../../../../../lib/getPayload'
import { RenderBlocks } from '../../../../../components/RenderBlocks'

export const dynamic = 'force-dynamic'

async function getData(slug: string, pageSlug: string) {
  const payload = await getPayloadClient()
  const { docs: editions } = await payload.find({
    collection: 'editions',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    depth: 0,
    limit: 1,
  })
  const edition = editions[0]
  if (!edition) return { edition: null, page: null, siblings: [] as any[] }

  const { docs: pages } = await payload.find({
    collection: 'pages',
    where: { edition: { equals: edition.id }, _status: { equals: 'published' } },
    sort: 'order',
    depth: 2,
    limit: 100,
  })
  const page = pages.find((p: any) => p.slug === pageSlug) ?? null
  return { edition, page, siblings: pages }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; pageSlug: string }>
}): Promise<Metadata> {
  const { slug, pageSlug } = await params
  const { page } = await getData(slug, pageSlug)
  if (!page) return { title: 'Page not found' }
  return {
    title: page.seo?.metaTitle || `${page.title} · The Edition`,
    description: page.seo?.metaDescription || undefined,
  }
}

export default async function MagazinePage({
  params,
}: {
  params: Promise<{ slug: string; pageSlug: string }>
}) {
  const { slug, pageSlug } = await params
  const { edition, page, siblings } = await getData(slug, pageSlug)
  if (!edition || !page) notFound()

  const idx = siblings.findIndex((p: any) => p.id === page.id)
  const prev = idx > 0 ? siblings[idx - 1] : null
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null

  return (
    <article className="container" style={{ paddingTop: 48, maxWidth: 820 }}>
      <p style={{ fontSize: 13, color: 'var(--muted)' }}>
        <Link href={`/editions/${edition.slug}`} style={{ textDecoration: 'none' }}>
          {edition.title}
        </Link>
      </p>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 44, lineHeight: 1.1 }}>{page.title}</h1>

      <RenderBlocks blocks={page.layout ?? []} />

      <nav className="page-nav">
        <span>{prev && <Link href={`/editions/${edition.slug}/${prev.slug}`}>← {prev.title}</Link>}</span>
        <span>{next && <Link href={`/editions/${edition.slug}/${next.slug}`}>{next.title} →</Link>}</span>
      </nav>
    </article>
  )
}
