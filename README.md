# Warrior Sports Performance

Static WSP website. Production branch: `main`. Zen Planner Studio owns member login, bookings, memberships, and billing. Namecheap remains the domain registrar.

## Build and checks

Node 22+; install with pnpm using the lockfile. Run `node scripts/build.mjs` and `node --test tests/*.test.mjs`. Local preview: `node scripts/serve.mjs`.

## Cloudflare Pages launch configuration

Import `bbershadWSP/WSP-Website`, framework Other, build `node scripts/build.mjs`, output `dist`. Use Cloudflare Pages Free. Ben chose this instead of a paid Vercel upgrade.

Default builds remain noindex. Set `ENABLE_INDEXING=true` in the Cloudflare Pages **Production** environment only when ready for the domain launch. The build also requires `CF_PAGES_BRANCH=main` (provided by Cloudflare) before enabling indexing. Preview builds stay noindex. The canonical domain is `https://warriorsportsperformance.com`. Build generates sitemap.xml and robots.txt. Alumni and 404 stay noindex. Robots rules are not authentication: no private member data is hosted here; member login stays on Studio.

Preserve existing page paths. `/general-fitness2` permanently redirects to `/`; Pages serves the existing directory routes. Configure www to redirect to the canonical root in Cloudflare domain/redirect settings.

## Forms and launch validation

Inquiry form uses FormSubmit to `info@warriorsportsperformance.com`. Test activation and inbox delivery from the deployed origin, checking Spam. Trial session two is arranged manually with Ben. Ask before creating actual memberships, payments, or customer notifications.

Before domain changes save the complete Namecheap DNS zone, including A/AAAA/CNAME, MX, SPF, DKIM, DMARC and verification records. Change only website records to the exact values Cloudflare supplies. Verify HTTPS, www redirects, bookings, inquiry delivery and business email before retiring previous hosting.

Rollback: restore the prior website A/AAAA/CNAME records from the dated DNS backup; keep old hosting active. Keep Studio and Namecheap active. Confirm exact subscriptions and data exports with Ben before canceling anything.

## Editing

`scripts/build.mjs`: templates; `src/content.mjs`: services and prices; `src/articles.json`: newest-first articles; `public/`: site assets; `src/widgets/`: public Studio embed snippets. Their public partition IDs are not admin credentials. Untracked `output/` belongs to separate work and must not be published accidentally.
