import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Editions } from './collections/Editions'
import { Pages } from './collections/Pages'
import { Decor } from './collections/Decor'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Build the Postgres connection string. We strip SSL/pooler query params
 * (sslmode, uselibpqcompat, supa, pgbouncer) from whatever the host injected
 * — on Vercel, Supabase's POSTGRES_URL ships `?sslmode=require`, which under
 * pg v3 semantics forces full cert verification and rejects Supabase's
 * self-signed chain, overriding the `ssl` option below. We instead control SSL
 * entirely in code (ssl.rejectUnauthorized: false).
 */
const buildConnectionString = (): string => {
  const raw =
    process.env.DATABASE_URI ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL ||
    ''
  if (!raw) return ''
  try {
    const url = new URL(raw)
    for (const p of ['sslmode', 'uselibpqcompat', 'supa', 'pgbouncer']) {
      url.searchParams.delete(p)
    }
    return url.toString()
  } catch {
    return raw
  }
}

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: path.resolve(dirname) },
    meta: {
      titleSuffix: '· Magazine CMS',
    },
  },
  collections: [Editions, Pages, Decor, Media, Users],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: buildConnectionString(),
      // Encrypt the connection but don't reject Supabase's self-signed chain.
      // For strict verification, download Supabase's CA cert and pass it as
      // { ca: fs.readFileSync(...) } instead.
      ssl: { rejectUnauthorized: false },
    },
    // Auto-creates/updates tables in dev. In production/CI use generated
    // migrations instead (payload migrate) for safe, reviewable schema changes.
    push: process.env.NODE_ENV !== 'production',
  }),
  plugins: [
    // On Vercel the runtime filesystem is read-only, so uploaded files must go
    // to external storage. When BLOB_READ_WRITE_TOKEN is set (i.e. on Vercel),
    // media is stored in Vercel Blob; locally, without the token, it falls back
    // to disk (staticDir: 'media').
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: { media: true },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  // sharp powers image resizing for the upload sizes defined on Media.
  sharp,
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
})
