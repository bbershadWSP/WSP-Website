# Warrior Sports Performance

A portable nine-page website for WSP, rebuilt from the public Engage site. GitHub owns the source; Vercel can serve the static build. Zen Planner **Studio** remains the system for calendar, trials, memberships, and billing.

## Review status

This is a review build. **Do not change Namecheap DNS, attach the business domain, cancel Engage, or cancel Studio.** Robots meta tags, robots.txt, and a Vercel response header currently block search indexing. They are not authentication or privacy controls.

## Run

Requires Node 22+ and pnpm. Run `pnpm install`, `pnpm build`, `pnpm test`, and `pnpm dev`. Preview at http://127.0.0.1:4173.

The production build itself uses only Node built-ins. `sharp` supports photo imports; `cheerio` supports migration and link tests.

## Edit

- `src/content.mjs`: business details, programs, and gallery entries.
- `scripts/build.mjs`: page templates and copy.
- `public/styles.css`: design system and responsive styling.
- `public/app.js`: navigation, filters, photo viewer, email-draft inquiry.
- `src/widgets/`: existing public Studio embed snippets. Their partition identifier is a public embed identifier, not an administrative API credential.
- `migration/`: source text, asset URLs, and migration notes. Raw downloaded HTML and original images are kept locally and ignored by Git.

## Photos in bulk

Run `node scripts/import-photos.mjs "C:/path/to/photos"`. It optimizes every supported image in that folder, strips metadata through re-encoding, avoids overwriting existing images, and creates a manifest. Add selected images with descriptive captions to `src/content.mjs`, then build. No image-by-image uploading is needed. Only publish photos you have permission to use.

## Vercel

Import `bbershadWSP/WSP-Website`, choose Other, build command `node scripts/build.mjs`, output `dist`. No environment secrets are needed. `vercel.json` records these settings. Use only the assigned Vercel address for review; do not add the custom domain. A commercial website needs a Vercel plan that permits commercial use (the Hobby plan does not).

## Before a later launch

1. Owner reviews desktop/mobile, copy, photos, rates, and privacy policy.
2. Validate actual trial registration and notifications with an authorized test; no real registrations or purchases were submitted during this build.
3. Decide whether the email-draft inquiry is sufficient or connect an independent form service. This version does not use Engage forms or chat and does not pretend to send a form.
4. Confirm Studio embed access persists after any Engage cancellation with Zen Planner. Preserve needed CRM/media/export data first.
5. Confirm an appropriate hosting plan. Add the domain only with explicit launch approval; preserve email/MX records.
6. Remove preview indexing blocks, add canonical URLs, sitemap and social image metadata, and validate redirects before launch.

Alumni had no published stories; the route is retained without invented achievements. This source code replaces Engage's layout/template behavior; it is not an export of proprietary Engage editor presets, CRM records, automations, or unpublished media.
