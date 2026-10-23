import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const source = fs.readFileSync('public/analytics.js', 'utf8');
function run(href, frames = []) {
  const handlers = {}, scripts = [], form = {}, messages = {};
  const window = {addEventListener: (name, callback) => { messages[name] = callback; }};
  const document = {
    referrer: 'https://example.com/page?email=private@example.com',
    createElement: () => ({}), head: { appendChild: script => scripts.push(script) },
    addEventListener: (name, callback) => { handlers[name] = callback; },
    querySelector: () => ({ addEventListener: (name, callback) => { form[name] = callback; } }),
    querySelectorAll: () => frames
  };
  vm.runInNewContext(source, { window, document, location: new URL(href), URL });
  return { window, handlers, scripts, form, messages };
}
test('Analytics never loads on preview or non-HTTPS origins', () => {
  for (const url of ['http://localhost:4173/', 'https://wsp.pages.dev/', 'https://preview.warriorsportsperformance.com/', 'http://warriorsportsperformance.com/']) {
    const result = run(url);
    assert.equal(result.scripts.length, 0);
    assert.equal(result.window.dataLayer, undefined);
  }
});

const trialFrame = () => ({
  src: 'https://studio.zenplanner.com/zenplanner/studio/freeTrialWidget.html?widgetInstanceId=a9f00ab2-aba9-4748-a1c1-1b5676125666',
  contentWindow: {}
});
const successMessage = frame => ({
  origin: 'https://studio.zenplanner.com', source: frame.contentWindow,
  data: {zpMessage: 'google.analytics', zpData: {type: 'event',
    eventCategory: 'zenplanner-tracking', eventAction: 'FreeTrialFormSubmit',
    eventLabel: 'private-person-id', dimensionsObj: {dimension1: 'private-partition-id'}}}
});

test('Provider-confirmed trial registration is counted once without forwarding identifiers', () => {
  const frame = trialFrame(), {window, messages} = run('https://warriorsportsperformance.com/getstarted/', [frame]);
  messages.message(successMessage(frame)); messages.message(successMessage(frame));
  const events = window.dataLayer.slice(2);
  assert.equal(events.length, 1);
  assert.equal(events[0][1], 'trial_registration_success');
  assert.deepEqual(JSON.parse(JSON.stringify(events[0][2])), {
    provider: 'zen_planner', registration_type: 'free_trial', transport_type: 'beacon'
  });
  assert.doesNotMatch(JSON.stringify(window.dataLayer), /private-person|private-partition|eventLabel|dimensionsObj/);
});

test('Trial measurement rejects spoofed sources, wrong widgets, starts, failures and malformed messages', () => {
  const frame = trialFrame(), {window, messages} = run('https://warriorsportsperformance.com/getstarted/', [frame]);
  for (const event of [
    {...successMessage(frame), origin:'https://example.com'},
    {...successMessage(frame), source:{}},
    {...successMessage(frame), data:null},
    {...successMessage(frame), data:{zpMessage:'widget.loaded'}},
    ...['FreeTrialFormStarted','FreeTrialFormError','MembershipSignUpFormSubmit'].map(action => {
      const event = successMessage(frame); event.data.zpData.eventAction = action; return event;
    })
  ]) messages.message(event);
  frame.src = frame.src.replace('a9f00ab2-aba9-4748-a1c1-1b5676125666', 'other-widget');
  messages.message(successMessage(frame));
  assert.equal(window.dataLayer.length, 2);
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
