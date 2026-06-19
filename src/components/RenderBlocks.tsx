import React from 'react'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { mediaUrl, mediaAlt } from '../lib/getPayload'

/**
 * Maps each Payload block (by blockType) to a presentational React component.
 * Add a block in src/blocks and a case here — that's the whole contract between
 * the CMS page builder and the front-end.
 */

type AnyBlock = Record<string, any>

function HeroBlock(b: AnyBlock) {
  const img = mediaUrl(b.image, 'feature')
  return (
    <section className={`block block-hero ${b.layout ?? 'centered'}`}>
      {img && b.layout === 'imageLeft' && <img src={img} alt={mediaAlt(b.image)} />}
      <div>
        {b.eyebrow && <div className="eyebrow">{b.eyebrow}</div>}
        <h2>{b.heading}</h2>
        {b.subheading && <p>{b.subheading}</p>}
      </div>
      {img && b.layout !== 'imageLeft' && (
        <img src={img} alt={mediaAlt(b.image)} style={{ marginTop: 24, borderRadius: 12 }} />
      )}
    </section>
  )
}

function RichTextBlock(b: AnyBlock) {
  if (!b.content) return null
  return (
    <div className="block block-rich">
      <RichText data={b.content} />
    </div>
  )
}

function ImageFeatureBlock(b: AnyBlock) {
  const img = mediaUrl(b.image, 'feature')
  if (!img) return null
  return (
    <figure className={`block figure ${b.size ?? 'wide'}`}>
      <img src={img} alt={mediaAlt(b.image)} style={{ borderRadius: 12 }} />
      {b.caption && <figcaption>{b.caption}</figcaption>}
    </figure>
  )
}

function GalleryBlock(b: AnyBlock) {
  const cols = Number(b.columns ?? 3)
  return (
    <div
      className="block gallery"
      style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
    >
      {(b.images ?? []).map((row: AnyBlock, i: number) => {
        const img = mediaUrl(row.image, 'card')
        if (!img) return null
        return (
          <figure key={i} className="figure" style={{ margin: 0 }}>
            <img src={img} alt={mediaAlt(row.image)} style={{ borderRadius: 8 }} />
            {row.caption && <figcaption>{row.caption}</figcaption>}
          </figure>
        )
      })}
    </div>
  )
}

function QuoteBlock(b: AnyBlock) {
  return (
    <blockquote className="block quote">
      “{b.quote}”
      {b.attribution && <cite>— {b.attribution}</cite>}
    </blockquote>
  )
}

function DecorShowcaseBlock(b: AnyBlock) {
  const items: AnyBlock[] = (b.items ?? []).filter((i: unknown) => typeof i === 'object')
  return (
    <section className="block">
      {b.heading && <h3 style={{ fontFamily: 'var(--font-serif)' }}>{b.heading}</h3>}
      <div className="decor-grid">
        {items.map((item, i) => {
          const img = mediaUrl(item.image, 'thumbnail')
          return (
            <div key={i} className="decor-item">
              {img && <img src={img} alt={mediaAlt(item.image)} style={{ borderRadius: 6 }} />}
              <strong>{item.name}</strong>
              {item.category && (
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{item.category}</div>
              )}
              {Array.isArray(item.swatches) && item.swatches.length > 0 && (
                <div className="swatches">
                  {item.swatches.map((s: AnyBlock, j: number) => (
                    <span key={j} className="swatch" style={{ background: s.hex }} title={s.hex} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </section>
  )
}

function CTABlock(b: AnyBlock) {
  return (
    <section className="block cta">
      <h2>{b.heading}</h2>
      {b.body && <p>{b.body}</p>}
      {b.buttonHref && b.buttonLabel && (
        <a className="btn" href={b.buttonHref}>
          {b.buttonLabel}
        </a>
      )}
    </section>
  )
}

const renderers: Record<string, (b: AnyBlock) => React.ReactNode> = {
  hero: HeroBlock,
  richText: RichTextBlock,
  imageFeature: ImageFeatureBlock,
  gallery: GalleryBlock,
  quote: QuoteBlock,
  decorShowcase: DecorShowcaseBlock,
  cta: CTABlock,
}

export function RenderBlocks({ blocks }: { blocks: AnyBlock[] }) {
  return (
    <>
      {(blocks ?? []).map((block, i) => {
        const renderer = renderers[block.blockType]
        if (!renderer) return null
        return <React.Fragment key={i}>{renderer(block)}</React.Fragment>
      })}
    </>
  )
}
