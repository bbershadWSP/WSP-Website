// Load only on the launched production domain, never on local or Pages previews.
(() => {
  if (location.protocol !== 'https:' || !['warriorsportsperformance.com', 'www.warriorsportsperformance.com'].includes(location.hostname)) return;
  const measurementId = 'G-R6YB4B784B';
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  const cleanUrl = value => {
    try { const url = new URL(value); return url.origin + url.pathname; }
    catch { return ''; }
  };
  window.gtag('js', new Date());
  window.gtag('config', measurementId, {
    page_location: cleanUrl(location.href),
    page_referrer: cleanUrl(document.referrer),
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(script);

  document.addEventListener('click', event => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const url = new URL(link.href, location.href);
    let name;
    if (url.protocol === 'tel:') name = 'phone_click';
    else if (url.protocol === 'mailto:') name = 'email_click';
    else if (url.origin === location.origin && /^\/getstarted\/?$/.test(url.pathname)) name = 'booking_link_click';
    if (name) window.gtag('event', name, { transport_type: 'beacon' });
  });
  // A browser submit is an attempt, not proof of delivery or a completed booking.
  document.querySelector('#inquiry-form')?.addEventListener('submit', () => {
    window.gtag('event', 'inquiry_submit_attempt', { transport_type: 'beacon' });
  });
})();
