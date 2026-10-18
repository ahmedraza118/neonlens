# NeonLens — photo & videography studio website

Next.js 16 (App Router, TypeScript, Tailwind v4) + **Payload CMS 3**, which runs inside the same app. The admin is at `/admin`.
It is built for three things: **ranking on Google** (local SEO), **turning visitors into inquiries**, and **running the business** (bookings, deposits, client galleries).

## What's included

| Area | Features |
| --- | --- |
| **Pages** | Home, Services, **Service × City landing pages** (`/services/wedding-photography/cluj-napoca`), Locations, Portfolio + case studies, Journal (blog + RSS), About, Reviews, FAQ, Pricing, Contact, Privacy |
| **SEO** | Per-page metadata + canonical URLs, editable SEO fields on every document, dynamic `sitemap.xml` with image entries, `robots.txt`, `llms.txt`, 1200×630 OG images generated for every upload plus a branded `/og` fallback card, JSON-LD (`LocalBusiness`, `Service`, `Offer`, `CreativeWork`, `ImageObject`, `VideoObject`, `Review`, `AggregateRating`, `FAQPage`, `BreadcrumbList`, `BlogPosting`, `WebSite`), Search Console verification, footer internal links to every service and city |
| **Images** | `next/image` with AVIF/WebP, responsive sizes, blur-up placeholders, focal points, and camera filenames (`IMG_1234.jpg`) automatically renamed from the alt text |
| **Video** | Mux (adaptive streaming) or YouTube, click-to-load so pages stay fast; optional muted showreel behind the home hero |
| **Leads** | Inquiry form on every page (honeypot + time-trap spam protection, UTM capture), saved in the CMS with a status pipeline, instant **email + WhatsApp** alert to you and an auto-reply to the client, floating WhatsApp button |
| **Quote calculator** | `/pricing`: service, hours, city travel fee and add-ons give a live price range; "Send me this quote" turns it into an inquiry |
| **Booking + deposits** | `/book`: live availability calendar (blocked dates + paid bookings), package picker, **Stripe Checkout** deposit, webhook confirmation, confirmation emails. Without Stripe it falls back to a booking request. |
| **Client galleries** | `/client/<code>`: password-protected proofing galleries. Clients favourite photos (with an optional limit), leave notes, submit their selection (you get notified) and download finals. Files are access-controlled, not just hidden. |
| **AI alt text** | `npm run alt-text` uses Claude vision to write alt text, captions and tags for your library, flagged for your review |

## Quick start

Requires **Node 20.18+** (Node 22 recommended — `nvm use` picks it from `.nvmrc`).

```bash
nvm use
npm install
cp .env.example .env      # then set PAYLOAD_SECRET, SEED_ADMIN_* and SEED_GALLERY_PASSWORD
npm run seed              # demo content + placeholder photos (deletes existing content!)
npm run dev
```

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin. Log in with `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` from `.env`.
- Demo client gallery: http://localhost:3000/client/demo-wedding, password `SEED_GALLERY_PASSWORD`.

| Script | What it does |
| --- | --- |
| `npm run dev` / `build` / `start` | Next.js |
| `npm run seed` | Wipes content and loads the demo data in `src/seed/data.ts` |
| `npm run alt-text [-- --all]` | AI alt text, captions and tags for media (needs `ANTHROPIC_API_KEY`) |
| `npm test` | Unit tests: quote maths, gallery session signing, passwords, utils |
| `npm run lint` / `typecheck` | Code checks |
| `npm run generate:types` | Regenerate `src/payload-types.ts` after changing collections |

## ⚠️ Before launch: replace the demo content

Everything in `src/seed/data.ts` is **placeholder**: business details, prices, projects, blog posts and especially **testimonials and stats. Never publish invented reviews.** Photos come from picsum.photos.

1. **Admin → Business & SEO settings**: real name, address, phone (identical to your Google Business Profile), social links, Google review link, rating.
2. **Services / Locations**: your real offers, prices, and *unique* local copy for each city. Thin copy-paste city pages can hurt rankings.
3. **Projects**: one case study per real shoot (brief, approach, result, gallery, testimonial).
4. **Pricing & quote calculator** and **Availability**: your rates and blocked dates.
5. Delete the demo client gallery and demo testimonials.

## Deploying (Vercel + Turso + Vercel Blob)

Serverless hosts have no persistent disk, so the database and uploads must live elsewhere:

1. **Database:** create a free [Turso](https://turso.tech) database (same SQLite/libSQL engine as local). Set `DATABASE_URL=libsql://…` and `DATABASE_AUTH_TOKEN`.
2. **Uploads:** in Vercel → Storage, create a **Blob** store. `BLOB_READ_WRITE_TOKEN` is added automatically and uploads switch to Blob.
3. Set `NEXT_PUBLIC_SERVER_URL=https://yourdomain.com` and a strong `PAYLOAD_SECRET`.
4. Deploy. Vercel runs `npm run vercel-build`, which applies the database migrations in `src/migrations` once and then builds.
5. Open `https://yourdomain.com/admin` and create your admin account (the first visit asks for one).

**Database migrations.** Locally the schema syncs automatically. After you change collections or fields, run `npm run migrate:create` so production gets the change on the next deploy.

Any Node host works too (Railway, Render, a VPS). With a persistent disk you can keep the SQLite file and local `media/` folder. For heavier traffic, swap `@payloadcms/db-sqlite` for `@payloadcms/db-postgres`.

### Integrations (all optional — the site works without them)

| Service | Env vars | Setup |
| --- | --- | --- |
| **Stripe** (deposits) | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | Developers → Webhooks → endpoint `https://yourdomain.com/webhooks/stripe`, events `checkout.session.completed` and `checkout.session.expired`. Locally: `stripe listen --forward-to localhost:3000/webhooks/stripe` |
| **Resend** (email) | `RESEND_API_KEY`, `EMAIL_FROM`, `NOTIFY_EMAIL` | Verify your domain in Resend |
| **Twilio WhatsApp** (lead alerts) | `TWILIO_*`, `NOTIFY_WHATSAPP_TO` | The sandbox works for testing |
| **Mux** (video) | none | Upload in the Mux dashboard and paste the **Playback ID** into the video field of a project, service, homepage or gallery |
| **Google** | `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`, `NEXT_PUBLIC_GA_ID` | Search Console + GA4 |
| **Claude** (alt text) | `ANTHROPIC_API_KEY` | Used only by `npm run alt-text` |

Without email or WhatsApp configured, notifications are printed to the server log.

## Getting ranked and getting booked

The code handles technical SEO. These steps bring the clients:

1. **Google Business Profile.** This is the biggest lever for local leads. Use exactly the same name, address and phone as the site, choose the categories *Photographer* and *Videographer*, upload photos weekly and add the GBP URL in settings.
2. **Ask every client for a Google review.** Set `googleReviewUrl` and the link appears in the footer and on `/reviews`. Send it with the gallery.
3. **Submit `https://yourdomain.com/sitemap.xml`** in Google Search Console and watch the *Performance* report for the queries you're close to ranking for.
4. **Publish a case study for every good shoot**, with venue + city in the title and alt text. These rank for long-tail searches like "wedding at Banffy Castle".
5. **Write the Journal posts buyers search for:** prices ("how much does a wedding videographer cost in X"), venue guides and checklists. Link each one to the related service.
6. **Use descriptive alt text** (run `npm run alt-text`, then review) and upload photos with real names. Google Images is real traffic for photographers.
7. **Earn backlinks:** get featured on venue and planner "recommended vendors" pages and wedding blogs, and post reels linking back to the matching service page.
8. **Answer inquiries fast.** The auto-reply buys time, but the first studio to reply personally usually wins. Track status in Admin → Inquiries.

## Project structure

```
src/
  app/(frontend)/      public site: pages, layout, global CSS
  app/(payload)/       Payload admin + REST/GraphQL API (generated)
  app/sitemap.ts, robots.ts, og/, llms.txt/, webhooks/stripe/
  actions/             server actions: inquiry, booking, gallery
  collections/         CMS schemas (Projects, Services, Locations, Posts, …)
  globals/             Site settings, Homepage, Pricing, Availability
  components/          UI components
  lib/                 queries, SEO/JSON-LD, quote maths, Stripe, notifications, sessions
  seed/                demo content + seed script
scripts/generate-alt-text.ts
tests/int/             unit tests
```
