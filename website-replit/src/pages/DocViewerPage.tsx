import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import SubPageLayout from "@/layouts/SubPageLayout";
import { ArrowLeft, Download, Loader2 } from "lucide-react";

const docFileMap: Record<string, string> = {
  installation: "COMPLETE_SETUP_GUIDE.md",
  quickstart: "setup.md",
  "quick-start": "setup.md",
  requirements: "building.md",
  faq: "answers.md",
  desktop: "desktop.md",
  mobile: "mobileosfeatures.md",
  overview: "project-overview.md",
  "project-overview": "project-overview.md",
  taumail: "taumail.md",
  "tau-mail": "taumail.md",
  taucloud: "taucloud.md",
  "tau-cloud": "taucloud.md",
  taustore: "tau-store.md",
  "tau-store": "tau-store.md",
  api: "API.md",
  API: "API.md",
  tauscript: "tauscript-complete.md",
  "tau-script": "tauscript-complete.md",
  security: "SECURITY.md",
  "data-protection": "data.md",
  deployment: "DEPLOYMENT.md",
  production: "PRODUCTION_SETUP.md",
  monitoring: "monitoring.md",
  troubleshooting: "troubleshooting.md",
  testing: "TESTING.md",
  contributing: "CONTRIBUTING.md",
  governance: "GOVERNANCE.md",
  "code-of-conduct": "CODE_OF_CONDUCT.md",
  licensing: "license.md",
  license: "license.md",
};

export default function DocViewerPage() {
  const { slug = "" } = useParams();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const file = docFileMap[slug] ?? docFileMap[slug.toLowerCase()];

  useEffect(() => {
    if (!file) {
      setError("Document not found");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    fetch(`/docs/${file}`)
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load ${file}`);
        return r.text();
      })
      .then(setContent)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [file, slug]);

  const title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <SubPageLayout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/docs" className="inline-flex items-center gap-2 text-primary text-sm mb-8 hover:underline">
          <ArrowLeft className="w-4 h-4" /> Documentation
        </Link>
        <h1 className="text-3xl font-bold mb-8 text-white">{title}</h1>
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin" /> Loading…
          </div>
        )}
        {error && <p className="text-red-400">{error}</p>}
        {!loading && !error && (
          <article className="prose prose-invert prose-headings:text-white prose-a:text-primary max-w-none whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-300">
            {content}
          </article>
        )}
        {file && (
          <a
            href={`/docs/${file}`}
            download
            className="inline-flex items-center gap-2 mt-10 text-primary text-sm hover:underline"
          >
            <Download className="w-4 h-4" /> Download markdown
          </a>
        )}
      </div>
    </SubPageLayout>
  );
}
