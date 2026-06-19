import React from 'react'
import Link from 'next/link'
import { getPayloadClient, mediaUrl, mediaAlt } from '../../lib/getPayload'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const payload = await getPayloadClient()
  const { docs: editions } = await payload.find({
    collection: 'editions',
    depth: 1,
    limit: 50,
    sort: '-publishDate',
    where: { _status: { equals: 'published' } },
  })

  return (
    <div className="container">
      <h1 className="lede">Every edition, beautifully made.</h1>
      <p className="lede-sub">
        A self-hosted magazine powered by Payload CMS v3. The editorial team builds each
        issue from reusable blocks and a shared decor catalog — no developer required.
      </p>

      {editions.length === 0 ? (
        <p style={{ color: 'var(--muted)' }}>
          No published editions yet. Sign in to the <Link href="/admin">admin panel</Link>,
          run the seed, or create an edition and hit publish.
        </p>
      ) : (
        <div className="grid">
          {editions.map((ed: any) => {
            const cover = mediaUrl(ed.cover, 'card')
            return (
              <Link key={ed.id} href={`/editions/${ed.slug}`} className="card">
                <div className="cover">
                  {cover && <img src={cover} alt={mediaAlt(ed.cover)} />}
                </div>
                <div className="meta">
                  <div className="issue">
                    {ed.issueNumber ? `Issue ${ed.issueNumber}` : 'Edition'}
                    {ed.featured ? ' · ' : ''}
                    {ed.featured && <span className="badge">Featured</span>}
                  </div>
                  <h3>{ed.title}</h3>
                  {ed.tagline && <p>{ed.tagline}</p>}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
