'use client';

import Logo from '@/components/marketing/Logo';
import { site } from '@/content/site';

export default function Footer() {
  return (
    <footer className="bg-[#020202] pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2">
            <Logo className="mb-6" href={null} />
            <p className="text-muted-foreground max-w-xs">{site.footer.blurb}</p>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Products</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {site.footer.products.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Developers</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {site.footer.developers.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Company</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              {site.footer.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-primary transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm text-muted-foreground">
          <p>{site.copyright}</p>
          <p className="mt-4 md:mt-0 text-primary/50 tracking-widest uppercase font-mono text-xs">
            Built with purpose.
          </p>
        </div>
      </div>
    </footer>
  );
}
