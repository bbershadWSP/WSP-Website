# Source inventory — 2026-10-09

Source: https://warriorsportsperformance.com and the authenticated Engage website “General Fitness 2 - Strength” (nine pages).

Preserved routes: /, /about/, /getstarted/, /pricingandservices/, /wspinaction/, /contact-us/, /schedule/, /alumni/, /privacy-policy/. /general-fitness2 redirects to home.

Recovered 36 public images: two brand marks, coach portrait, facility photo, and 32 training/community photographs. Optimized copies are versioned under public/images. Original URL inventory is in asset-sources.json. Existing copy snapshots are in the corresponding .txt files. Source HTML stays local and is excluded from Git because builder serialization can contain unnecessary implementation metadata.

Preserved Studio calendar, memberships, and free trial embed identifiers unchanged. Studio billing data, member records, and account configuration were not accessed or migrated. No Namecheap DNS or live Engage page was changed.

Replaced unfinished testimonial placeholders with genuine program/coach content. Correct Instagram retained; vendor Facebook/Twitter removed. Alumni is honestly marked as upcoming. Contact uses an explicitly labeled email draft; no submission backend is implied. Existing privacy policy content is retained, with readable headings, and should be reviewed before launch.

Not exported: Engage's proprietary editor presets, unpublished content/media, marketing automations, social account connections, CRM data, or staff/member data. This is a reconstruction of the published website and its useful content, not a full account backup.

## Additional photo import — 2026-10-09

Added all 21 College Group and 62 GUT Camp photos from the user-requested Documents folders. 33 source files matched already-recovered images exactly by SHA-256 and reuse those assets; 50 new WebP files were generated. Original local photos were not modified. Gallery entries are in src/photo-collections.json, with collection filters and batches of 24. Instagram @wsp_norfolk was confirmed, but post/reel access requires sign-in and none have been imported yet.
