/** Core tracker/ad domains blocked by Tau Browser (expandable via API). */
export const TRACKER_DOMAINS = [
  'doubleclick.net',
  'googlesyndication.com',
  'googleadservices.com',
  'google-analytics.com',
  'googletagmanager.com',
  'facebook.net',
  'connect.facebook.net',
  'analytics.twitter.com',
  'ads.twitter.com',
  'scorecardresearch.com',
  'hotjar.com',
  'mixpanel.com',
  'segment.io',
  'segment.com',
  'newrelic.com',
  'nr-data.net',
  'quantserve.com',
  'outbrain.com',
  'taboola.com',
  'criteo.com',
  'adnxs.com',
  'rubiconproject.com',
  'pubmatic.com',
  'openx.net',
  'moatads.com',
  'amazon-adsystem.com',
  'adservice.google.com',
  'pagead2.googlesyndication.com',
  'static.ads-twitter.com',
  'bat.bing.com',
  'clarity.ms',
  'yandex.ru/metrika',
  'mc.yandex.ru',
  'pixel.facebook.com',
  'tr.snapchat.com',
  'ads.linkedin.com',
  'px.ads.linkedin.com',
  'tiktok.com/i18n/pixel',
  'analytics.tiktok.com',
];

export const AD_DOMAINS = [
  'adsafeprotected.com',
  'advertising.com',
  'adform.net',
  'adition.com',
  'adroll.com',
  'adsrvr.org',
  'casalemedia.com',
  'contextweb.com',
  'exelator.com',
  'lijit.com',
  'mathtag.com',
  'media.net',
  'popads.net',
  'propellerads.com',
  'revcontent.com',
  'smartadserver.com',
  'spotxchange.com',
  'zedo.com',
];

export function getBlocklist() {
  const domains = Array.from(new Set([...TRACKER_DOMAINS, ...AD_DOMAINS])).sort();
  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    domains,
    trackers: TRACKER_DOMAINS.length,
    ads: AD_DOMAINS.length,
  };
}

export function isBlockedDomain(hostname: string, blockAds = true, blockTrackers = true): boolean {
  const host = hostname.toLowerCase().replace(/^\./, '');
  const lists: string[] = [];
  if (blockTrackers) lists.push(...TRACKER_DOMAINS);
  if (blockAds) lists.push(...AD_DOMAINS);
  return lists.some(
    (d) => host === d || host.endsWith(`.${d}`)
  );
}
