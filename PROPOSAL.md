# Upwork proposal — Payload CMS v3 (Vercel) + multi-edition magazine

## Short version (paste into the Upwork cover letter)

Hi — I build exactly this stack: Payload CMS v3 installed into Next.js (App Router), TypeScript, Postgres, deployed on Vercel.

To show I understand the brief rather than just claim it, I built a small working reference of your project: a multi-edition magazine on Payload v3 + Postgres + Next.js, Vercel-ready. It has Editions, Pages built from reusable content blocks, a shared Decor catalog, Media, and three editor roles with access control — plus a front-end that renders the published editions. Repo/demo links below.

**Phase 1 (the build fix).** Payload v3 on Vercel usually fails for one of a small set of reasons: schema `push` running against the DB at build time, a direct (non-pooled) Postgres connection on serverless, `sharp`/native deps, missing env vars, or cold-init timeouts. In my reference each of these is already handled (e.g. `push` is off in production in favour of migrations, pooled connection string, raised function `maxDuration`). Send me your current build log and I'll tell you on our first call which line is failing and the fix — this is typically a same-day task.

**Phase 2 (the model + front-end).** The structure in my reference maps directly to what you described: editions, pages, reusable blocks, the shared decor catalog, media, and roles, with a Next.js front-end rendering it. Once you share the visual design I'll match the front-end to it and extend the model (e.g. scoping editors to specific editions, scheduled publishing, previews).

Proven Payload v3 + Next.js + Vercel + Postgres experience — happy to walk through the reference live and adapt it to your repo.

Links:
- Live demo: <add your Vercel URL>
- Code: <add your GitHub URL>

— Alex

---

## How to use this

1. Deploy the project in this folder to Vercel (see `README.md`), add a Postgres DB, run the seed, and you have a live demo URL to drop into the proposal.
2. Push the same folder to a public GitHub repo for the code link.
3. Trim the cover letter to fit Upwork's limit — lead with the "I built a working reference of your exact project" line; that's the differentiator most bids won't have.

## Talking points for the interview / call

- **Why Payload v3 fits them:** it installs directly into Next.js (no separate server to host), the admin panel is React Server Components, and the Local API lets the front-end query content with no extra HTTP hop — fast on Vercel.
- **The five Vercel failure modes** (from the README): be ready to name them. Asking for their build log and naming the likely culprit before being hired signals real experience.
- **Roles:** admin / editor / author, with field-level access so only admins can change roles. Easy to extend to per-edition permissions.
- **Reusable blocks + shared decor:** the editorial team composes pages without a developer, and decor is defined once and referenced everywhere — directly answers their "reusable content blocks" and "shared decor catalog" asks.
- **Production hygiene:** migrations instead of `push`, a storage adapter (Vercel Blob/S3) for media because Vercel's runtime FS is read-only.

## Honest scoping note

Phase 1 is small and low-risk (a config/env/deploy fix). Phase 2 is the real engagement — quote it separately once you've seen their design and repo. Don't over-promise a fixed price on Phase 2 before seeing the design files.
