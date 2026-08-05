/** Maps TXP product slugs to existing product landing pages. */
export const productLandingRoutes: Record<string, string> = {
  'tau-phone': '/products/tau-mobile-os',
  'tau-talk': '/tautalk',
  'tau-mail': '/taumail',
  'tau-cloud': '/taucloud',
  'tau-ai': '/tauai',
  'tau-browser': '/taubrowser',
  'tau-id': '/tauid',
  'tau-market': '/taustore',
  'tau-developer': '/developers',
};

export function productHref(slug: string): string {
  return productLandingRoutes[slug] ?? `/products/${slug}`;
}
