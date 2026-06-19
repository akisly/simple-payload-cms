import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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
      // Prefer DATABASE_URI; fall back to the vars Vercel's Neon/Postgres
      // integration injects automatically. Use the POOLED string on serverless.
      connectionString:
        process.env.DATABASE_URI ||
        process.env.POSTGRES_URL ||
        process.env.DATABASE_URL ||
        '',
      // Supabase's pooler presents a cert that isn't in Node's default CA store,
      // which throws "self-signed certificate in certificate chain". Encrypt the
      // connection but don't reject the chain. For strict verification instead,
      // download Supabase's CA cert and pass it as { ca: fs.readFileSync(...) }.
      ssl: { rejectUnauthorized: false },
    },
    // Auto-creates/updates tables in dev. In production/CI use generated
    // migrations instead (payload migrate) for safe, reviewable schema changes.
    push: process.env.NODE_ENV !== 'production',
  }),
  // sharp powers image resizing for the upload sizes defined on Media.
  sharp,
  graphQL: {
    schemaOutputFile: path.resolve(dirname, 'generated-schema.graphql'),
  },
})
