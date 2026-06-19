import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPayloadClient, mediaUrl, mediaAlt } from '../../../../lib/getPayload'

export const dynamic = 'force-dynamic'

async function getEdition(slug: string) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'editions',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    depth: 2,
    limit: 1,
  })
  return docs[0] ?? null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const edition = await getEdition(slug)
  if (!edition) return { title: 'Edition not found' }
  return { title: `${edition.title} · The Edition`, description: edition.tagline ?? undefined }
}

export default async function EditionPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payload = await getPayloadClient()
  const edition = await getEdition(slug)
  if (!edition) notFound()

  const { docs: pages } = await payload.find({
    collection: 'pages',
    where: { edition: { equals: edition.id }, _status: { equals: 'published' } },
    sort: 'order',
    depth: 0,
    limit: 100,
  })

  const accent = edition.theme?.accentColor
  const cover = mediaUrl(edition.cover, 'feature')

  return (
    <div style={accent ? ({ ['--accent' as any]: accent } as React.CSSProperties) : undefined}>
      <div className="container edition-hero">
        <div className="issue">
          {edition.issueNumber ? `Issue ${edition.issueNumber}` : 'Edition'}
          {edition.publishDate
            ? ` · ${new Date(edition.publishDate).toLocaleDateString('en-US', {
                month: 'long',
                year: 'numeric',
              })}`
            : ''}
        </div>
        <h1>{edition.title}</h1>
        {edition.tagline && <p style={{ fontSize: 20, color: 'var(--muted)' }}>{edition.tagline}</p>}
        {cover && (
          <img
            src={cover}
            alt={mediaAlt(edition.cover)}
            style={{ borderRadius: 14, marginTop: 24, maxHeight: 520, objectFit: 'cover', width: '100%' }}
          />
        )}
      </div>

      <div className="container">
        <h2 style={{ fontFamily: 'var(--font-serif)', marginTop: 48 }}>In this issue</h2>
        {pages.length === 0 ? (
          <p style={{ color: 'var(--muted)' }}>No published pages in this edition yet.</p>
        ) : (
          <ul className="toc">
            {pages.map((p: any, i: number) => (
              <li key={p.id}>
                <Link href={`/editions/${edition.slug}/${p.slug}`}>
                  <span>{p.title}</span>
                  <span className="num">{String(i + 1).padStart(2, '0')}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p style={{ marginTop: 40 }}>
          <Link href="/" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            ← All editions
          </Link>
        </p>
      </div>
    </div>
  )
}
