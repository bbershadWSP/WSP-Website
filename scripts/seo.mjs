import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {business, photos} from '../src/content.mjs';

const origin = 'https://warriorsportsperformance.com';
// Read the actual assets so portrait photos and inline article images reserve
// the right space before loading. CSS still controls their displayed size.
const dimensions = new Map(await Promise.all(
  fs.readdirSync('public/images').filter(name => name.endsWith('.webp')).map(async name => {
    const {width, height} = await sharp(path.join('public/images', name)).metadata();
    return ['/images/' + name, {width, height}];
  })
));

export function reserveImageSpace(html) {
  return html.replace(/<img\b[^>]*>/g, tag => {
    const src = tag.match(/\bsrc="([^"]+)"/)?.[1];
    const size = dimensions.get(src);
    if (!size) return tag;
    return tag.replace(/\s(?:width|height)="[^"]*"/g, '')
      .replace(/>$/, ` width="${size.width}" height="${size.height}">`);
  });
}

export function businessStructuredData(route) {
  // Contact is the page displaying the full business details and hours.
  if (route !== '/contact-us/') return '';
  const data = {
    '@context': 'https://schema.org', '@type': 'LocalBusiness',
    '@id': origin + '/#business', name: business.name, url: origin + '/',
    telephone: '+15085288930', email: business.email,
    image: origin + photos.facility,
    address: {'@type': 'PostalAddress', streetAddress: '124 Main Street',
      addressLocality: 'Norfolk', addressRegion: 'MA', postalCode: '02056', addressCountry: 'US'},
    sameAs: [business.instagram, business.facebook],
    openingHoursSpecification: [
      {'@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '06:00', closes: '20:00'},
      {'@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '07:00', closes: '15:00'}
    ]
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replaceAll('<', '\\u003c')}</script>`;
}
