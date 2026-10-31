import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import * as cheerio from 'cheerio';

const origin = 'https://warriorsportsperformance.com';
const xml = cheerio.load(fs.readFileSync('dist/sitemap.xml', 'utf8'), {xmlMode:true});
const urls = xml('loc').toArray().map(el => xml(el).text());
const load = url => cheerio.load(fs.readFileSync(path.join('dist', new URL(url).pathname, 'index.html'), 'utf8'));

test('Every sitemap URL is unique, canonical, linked, and has unique search metadata', () => {
  assert.equal(new Set(urls).size, urls.length);
  const titles = new Set(), descriptions = new Set(), linked = new Set();
  for (const url of urls) {
    assert.equal(new URL(url).origin, origin);
    const $ = load(url);
    assert.equal($('link[rel=canonical]').length, 1);
    assert.equal($('link[rel=canonical]').attr('href'), url);
    const title = $('title').text(), description = $('meta[name=description]').attr('content');
    assert.ok(title && description);
    assert.ok(!titles.has(title), title); titles.add(title);
    assert.ok(!descriptions.has(description), description); descriptions.add(description);
    $('a[href]').each((_, el) => linked.add(new URL($(el).attr('href'), url).href.split('#')[0].split('?')[0]));
  }
  for (const url of urls) assert.ok(linked.has(url), `Orphan: ${url}`);
});

test('Public-page images reserve their actual intrinsic dimensions, including inline article photos', async () => {
  const sizes = new Map();
  for (const url of urls) {
    const $ = load(url);
    for (const img of $('img[src]').toArray()) {
      const src = $(img).attr('src');
      if (!src.startsWith('/images/')) continue;
      if (!sizes.has(src)) sizes.set(src, await sharp(path.join('public',src)).metadata());
      const {width,height} = sizes.get(src);
      assert.equal(Number($(img).attr('width')), width, `${url}: ${src}`);
      assert.equal(Number($(img).attr('height')), height, `${url}: ${src}`);
    }
  }
});

test('Contact structured data matches visible identity and contains no invented rating or offer', () => {
  const $ = load(origin + '/contact-us/');
  const data = JSON.parse($('script[type="application/ld+json"]').text());
  assert.equal(data['@type'], 'LocalBusiness');
  assert.equal(data.url, origin + '/');
  assert.ok($('body').text().includes(data.name));
  assert.ok($('address').text().includes(data.address.streetAddress));
  assert.ok($('address').text().includes(data.address.postalCode));
  assert.ok($(`a[href="tel:${data.telephone}"]`).length);
  assert.ok($(`a[href="mailto:${data.email}"]`).length);
  assert.match($('.contact-info').text(), /Monday[–-]Friday, 6am[–-]8pm/);
  assert.match($('.contact-info').text(), /Saturday, 7am[–-]3pm/);
  assert.equal(data.openingHoursSpecification[0].opens, '06:00');
  assert.equal(data.openingHoursSpecification[1].closes, '15:00');
  assert.equal(data.aggregateRating, undefined);
  assert.equal(data.review, undefined);
  assert.equal(data.offers, undefined);
  for (const url of urls.filter(url => !url.endsWith('/contact-us/'))) {
    const page=load(url), scripts=page('script[type="application/ld+json"]');
    if (!url.includes('/articles/') || url.endsWith('/articles/')) { assert.equal(scripts.length,0); continue; }
    assert.equal(scripts.length,1);
    const article=JSON.parse(scripts.text());
    assert.equal(article['@type'],'BlogPosting');
    assert.equal(article.headline,page('h1').text());
    assert.equal(article.mainEntityOfPage,url);
    assert.equal(article.author.name,'Ben Bershad');
    assert.equal(article.author.url,origin+'/about/#coach');
    assert.equal(article.image[0],origin+page('article img').first().attr('src'));
    assert.equal(page('meta[property="og:image"]').attr('content'),article.image[0]);
    assert.equal(page('meta[property="og:type"]').attr('content'),'article');
    if(article.datePublished) assert.equal(article.datePublished,'2026-10-31');
    assert.equal(article.aggregateRating,undefined);
  }
});
