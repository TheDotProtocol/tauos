#!/usr/bin/env node
/**
 * Port Next.js pages from src/app into website-replit content components.
 * Strips duplicate headers; SubPageLayout provides site chrome.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = path.join(root, "src/app");
const outRoot = path.join(root, "website-replit/src/pages/content");

const pages = [
  { src: "about/page.tsx", name: "AboutContent.tsx", exportName: "AboutContent" },
  { src: "beta/page.tsx", name: "BetaContent.tsx", exportName: "BetaContent" },
  { src: "developers/page.tsx", name: "DevelopersContent.tsx", exportName: "DevelopersContent" },
  { src: "governance/page.tsx", name: "GovernanceContent.tsx", exportName: "GovernanceContent" },
  { src: "contact/page.tsx", name: "ContactContent.tsx", exportName: "ContactContent" },
  { src: "legal/page.tsx", name: "LegalContent.tsx", exportName: "LegalContent" },
  { src: "legal/privacy/page.tsx", name: "PrivacyContent.tsx", exportName: "PrivacyContent" },
  { src: "docs/page.tsx", name: "DocsContent.tsx", exportName: "DocsContent" },
];

function transform(source) {
  let s = source;
  s = s.replace(/^'use client';\s*\n/m, "");
  s = s.replace(/^"use client";\s*\n/m, "");
  s = s.replace(/import Link from 'next\/link';\s*\n/g, "");
  s = s.replace(/import Link from "next\/link";\s*\n/g, "");
  s = s.replace(/<Link(\s)/g, "<a$1");
  s = s.replace(/<\/Link>/g, "</a>");
  // Remove sticky header blocks (old site nav — SubPageLayout replaces it)
  s = s.replace(
    /\{\/\* Header \*\/\}[\s\S]*?<\/header>\s*\n/m,
    ""
  );
  s = s.replace(
    /<header className="[^"]*sticky[^"]*"[\s\S]*?<\/header>\s*\n/m,
    ""
  );
  s = s.replace(
    /<header className="border-b border-gray-800[\s\S]*?<\/header>\s*\n/m,
    ""
  );
  // Remove old nav blocks in legal page
  s = s.replace(
    /\{\/\* Navigation \*\/\}[\s\S]*?<\/nav>\s*\n/m,
    ""
  );
  // Docs hub title header is preserved; only remove site nav blocks
  s = s.replace(/export default function \w+/g, (m) => m.replace("function ", "function "));
  return s;
}

for (const { src, name, exportName } of pages) {
  const inPath = path.join(srcRoot, src);
  if (!fs.existsSync(inPath)) {
    console.warn("skip missing", src);
    continue;
  }
  let body = fs.readFileSync(inPath, "utf8");
  body = transform(body);
  body = body.replace(/export default function (\w+)/, `export function ${exportName}`);
  const out = `/* Ported from src/app/${src} — content preserved from legacy site */\n${body}`;
  fs.writeFileSync(path.join(outRoot, name), out);
  console.log("ported", name);
}
