import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync('public/analytics.js', 'utf8');
function run(href) {
  const handlers = {}, scripts = [], form = {}, window = {};
  const document = {
    referrer: 'https://example.com/page?email=private@example.com',
    createElement: () => ({}), head: { appendChild: script => scripts.push(script) },
    addEventListener: (name, callback) => { handlers[name] = callback; },
    querySelector: () => ({ addEventListener: (name, callback) => { form[name] = callback; } })
  };
  vm.runInNewContext(source, { window, document, location: new URL(href), URL });
  return { window, handlers, scripts, form };
}
test('Analytics never loads on preview or non-HTTPS origins', () => {
  for (const url of ['http://localhost:4173/', 'https://wsp.pages.dev/', 'https://preview.warriorsportsperformance.com/', 'http://warriorsportsperformance.com/']) {
    const result = run(url);
    assert.equal(result.scripts.length, 0);
    assert.equal(result.window.dataLayer, undefined);
  }
});
test('Production loads the correct tag and strips query strings from page metadata', () => {
  const {window, scripts} = run('https://warriorsportsperformance.com/contact-us/?email=private@example.com#message');
  assert.equal(scripts.length, 1);
  assert.equal(scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-R6YB4B784B');
  const config = window.dataLayer[1];
  assert.equal(config[2].page_location, 'https://warriorsportsperformance.com/contact-us/');
  assert.equal(config[2].page_referrer, 'https://example.com/page');
});
test('Booking clicks and form attempts never claim completed bookings or delivered leads', () => {
  const {window, handlers, form} = run('https://warriorsportsperformance.com/');
  for (const href of ['/getstarted/', 'tel:+15085288930', 'mailto:info@warriorsportsperformance.com']) handlers.click({target:{closest:()=>({href})}});
  form.submit();
  assert.deepEqual(Array.from(window.dataLayer).slice(2).map(args => args[1]), ['booking_link_click', 'phone_click', 'email_click', 'inquiry_submit_attempt']);
  assert.doesNotMatch(JSON.stringify(window.dataLayer), /generate_lead|booking_complete|private@example.com/);
});
