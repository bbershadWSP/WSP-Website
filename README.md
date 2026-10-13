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

## Analytics and Search Console

Owner: `bbershad@warriorsportsperformance.com`. Search Console domain ownership was auto-verified October 13, 2026 using existing DNS; no records were edited. GA4 account `411816447`, property `558745274` (WSP Website), stream `16121894906`, measurement ID `G-R6YB4B784B`. New York time, USD, optional Analytics emails and account data sharing off.

`public/analytics.js` is included only in indexing-enabled production builds and checks for the HTTPS apex/www production domain. Local and Pages preview visits do not send data. Custom events: `booking_link_click`, `phone_click`, `email_click`, `inquiry_submit_attempt`. None represents completed booking or confirmed delivery, and no form fields are included. Automatic GA4 form interactions and site search are off.

After the domain switches to Cloudflare:

1. Check production `ENABLE_INDEXING=true`, canonical URLs, live robots.txt and nonempty sitemap.xml with current article routes.
2. Submit `https://warriorsportsperformance.com/sitemap.xml` to the verified Search Console domain property, then verify Google's processing result.
3. Verify page views and custom events in GA4 Realtime, checking for duplicate tags/events.
4. Test FormSubmit activation, spam checks and inbox delivery. A submit event is only an attempt. Establish a confirmed provider-success signal before configuring a delivered-inquiry key event. Studio completion also needs a confirmed success signal; never count a booking-link click as completion.

Live tracking checks, inquiry delivery and sitemap submission remain pending the domain switch. The existing Engage site was not modified. No recurring monitoring has been scheduled.

## Editing

`scripts/build.mjs`: templates; `src/content.mjs`: services and prices; `src/articles.json`: newest-first articles; `public/`: site assets; `src/widgets/`: public Studio embed snippets. Their public partition IDs are not admin credentials. Untracked `output/` belongs to separate work and must not be published accidentally.
