# Multi-Edition Magazine — Payload CMS v3 + Next.js

A self-hosted, team-editable magazine. The editorial team creates and edits multiple **editions** (issues), builds **pages** from reusable content **blocks**, draws from a shared **decor** catalog, manages **media**, and works under role-based **editor permissions** — all from the Payload admin panel. A Next.js (App Router) front-end renders the published editions.

This repo is a compact but production-shaped reference for exactly the two phases described in the brief:

- **Phase 1** — a clean Payload v3 + Postgres + Next.js app that builds and deploys to Vercel, with the admin panel loading and login working.
- **Phase 2** — the multi-edition content model (editions, pages, reusable blocks, shared decor, media, roles) plus a front-end that renders it.

---

## Stack

- **Payload CMS v3** (installed directly into Next.js — no separate server)
- **Next.js 15** (App Router, React Server Components)
- **PostgreSQL** via `@payloadcms/db-postgres` (Drizzle) — works with Vercel Postgres, Supabase, Neon
- **Lexical** rich text
- **TypeScript** throughout
- Deploys to **Vercel**

## Project structure

```
src/
  payload.config.ts            # single source of truth: collections, db, admin
  collections/
    Editions.ts                # one issue of the magazine (drafts + autosave)
    Pages.ts                   # block-built page, belongs to an edition
    Decor.ts                   # shared, reusable decor catalog
    Media.ts                   # uploads with image sizes
    Users.ts                   # auth + roles (admin / editor / author)
  blocks/index.ts              # reusable layout blocks (hero, rich text, gallery, decor showcase, …)
  access/index.ts              # role-based access control helpers
  seed.ts                      # demo data (admin user + one edition + pages)
  lib/getPayload.ts            # Local API client + media helpers
  components/RenderBlocks.tsx  # maps each block type to a React component
  app/
    (payload)/                 # admin panel + REST/GraphQL API (generated boilerplate)
    (frontend)/                # public website
      page.tsx                 # editions index
      editions/[slug]/         # edition cover + table of contents
      editions/[slug]/[pageSlug]/  # a rendered page
```

## Data model

- **Edition** — title, slug, issue number, publish date, cover, tagline, a `theme` (accent colour + decor pulled from the shared catalog), `featured` flag. Drafts + autosave + version history.
- **Page** — belongs to an Edition, has an `order`, and a `layout` built from reusable blocks. SEO group.
- **Decor** — the shared catalog (palettes, patterns, props, type sets, textures). Referenced from editions and from the `decorShowcase` block, so it's defined once and reused everywhere.
- **Media** — uploads with `thumbnail` / `card` / `feature` image sizes.
- **Users** — email/password auth with three roles. Only admins can change roles; editors run the day-to-day content; the access layer is small and composable so it's easy to scope editors to specific editions later.

Add a block in `src/blocks/index.ts` and a matching case in `RenderBlocks.tsx` — that's the entire contract between the page builder and the front-end.

---

## Run locally

Requires Node 20+ and a Postgres database.

```bash
pnpm install            # or npm install
cp .env.example .env     # then fill in the values

# point DATABASE_URI at a local or hosted Postgres, then:
pnpm dev                 # http://localhost:3000  (front-end)
                         # http://localhost:3000/admin  (admin panel)

pnpm seed                # optional: create demo admin + an edition with pages
# Demo login -> admin@example.com / changeme123
```

`pnpm generate:types` regenerates `src/payload-types.ts` from the config, and `pnpm generate:importmap` refreshes the admin import map after adding custom components.

---

## Deploy to Vercel

1. Push to a Git repo and import it in Vercel.
2. Add a Postgres database (Vercel Postgres, Supabase, or Neon) and set the env vars below.
3. Deploy. The admin panel lives at `/admin`, the API at `/api`.

### Required environment variables

| Variable | Purpose |
| --- | --- |
| `DATABASE_URI` | Postgres connection string (use the **pooled** string on serverless) |
| `PAYLOAD_SECRET` | Secret for signing auth tokens (`openssl rand -base64 32`) |
| `NEXT_PUBLIC_SERVER_URL` | Public URL, e.g. `https://your-app.vercel.app` |

---

## The Phase-1 build issue on Vercel (and how it's avoided here)

Payload v3 deployments on Vercel fail to build/boot for a handful of recurring reasons. Each is addressed in this repo:

1. **Schema "push" running against a serverless DB at build time.**
   With the Postgres adapter, `push: true` mutates the schema on boot. On Vercel that's fragile and slow. Here `push` is enabled only outside production (`push: process.env.NODE_ENV !== 'production'`); in production you ship reviewable **migrations** (`payload migrate`). This alone resolves a large share of "There was an error initializing Payload" failures.

2. **Pooled vs. direct connection strings.** Serverless functions exhaust direct Postgres connections. Use the provider's **pooled** connection string for `DATABASE_URI` (Supabase pgBouncer / Neon pooled / Vercel Postgres pooled).

3. **`sharp` / native deps not bundled.** `sharp` is a real dependency and image resizing is enabled, so Vercel installs the right binary. `next.config.mjs` uses `withPayload(..., { devBundleServerPackages: false })` to keep server-only packages out of the dev bundle.

4. **Missing or build-time-only env vars.** `PAYLOAD_SECRET` and `DATABASE_URI` must be present in the Vercel project (all environments). The config reads them defensively so a missing var fails loudly with a clear message instead of a cryptic build crash.

5. **Function timeout on cold init.** `vercel.json` raises the API route `maxDuration` so the first request (which initializes Payload and connects to Postgres) doesn't hit the default limit.

> If you share the exact build log from your current Vercel deployment, the failing line almost always maps to one of the five above — happy to pinpoint it on a quick call.

## Production notes

- **Migrations over push:** generate with `payload migrate:create`, run `payload migrate` in the deploy step before `next build`.
- **File storage:** Vercel's runtime filesystem is read-only, so local-disk uploads don't persist. Swap `Media.upload` for a storage adapter (`@payloadcms/storage-vercel-blob` or `@payloadcms/storage-s3`) in production.
