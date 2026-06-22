import Logo from "@/components/Logo";
import { site } from "@/content/site";

function LinkList({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-white font-bold mb-6">{title}</h4>
      <ul className="space-y-4 text-sm text-muted-foreground">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="hover:text-primary transition-colors">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#020202] pt-24 pb-12 border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2">
            <Logo className="mb-6" />
            <p className="text-muted-foreground max-w-xs">{site.footer.blurb}</p>
          </div>

          <LinkList title="Products" links={[...site.footer.products]} />
          <LinkList title="Developers" links={[...site.footer.developers]} />
          <LinkList title="Company" links={[...site.footer.company]} />
        </div>

        <div className="mb-8">
          <h4 className="text-white font-bold mb-4 text-sm">Legal &amp; compliance</h4>
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {site.footer.legal.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-primary transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-sm text-muted-foreground">
          <p>{site.copyright}</p>
          <p className="mt-4 md:mt-0 text-primary/50 tracking-widest uppercase font-mono text-xs">
            {site.brand} — Built with purpose.
          </p>
        </div>
      </div>
    </footer>
  );
}
