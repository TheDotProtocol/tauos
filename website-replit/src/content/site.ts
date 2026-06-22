/**
 * TauOS site content — sourced from the legacy tauos.org site.
 * Replit redesign uses this for copy; logo from /public/brand/tauos-logo.svg
 */
export const site = {
  name: "TauOS",
  brand: "TAU CORE™",
  tagline: "Privacy First. AI Native. Built For Humanity.",
  description:
    "The next generation operating system designed for people who want power, privacy, intelligence and freedom.",
  mission:
    "We built TauCore™ with one idea in mind: technology should belong to people, not the other way around. Our mission is to create a complete, secure, zero-telemetry operating system.",
  company: "Tau Foundation and Tau LLC",
  copyright:
    "© 2026 Tau Foundation and Tau LLC, a Unit of AR Holdings Group Corporation, All Rights Reserved.",
  legalCopyright: "© 2026 Tau Foundation & Tau LLC. All rights reserved.",
  siteUrl: "https://www.tauos.org",
  supportEmail: "support@tauos.org",

  nav: [
    { label: "OS", href: "#os" },
    { label: "Mobile", href: "#mobile" },
    { label: "AI", href: "#ai" },
    { label: "Developers", href: "#developers" },
    { label: "Enterprise", href: "#enterprise" },
  ],

  cta: {
    primary: { label: "Download TauOS", href: "/download" },
    secondary: { label: "Explore Apps", href: "/apps" },
    nav: { label: "Download Beta", href: "/download" },
  },

  ecosystem: [
    {
      name: "Tau OS Desktop",
      tag: "Bootable privacy-first desktop for PCs",
      href: "/desktop",
    },
    {
      name: "Tau Mobile",
      tag: "Mobile OS — coming in a future release",
      href: "/mobile",
    },
    {
      name: "Tau Cloud",
      tag: "Zero-knowledge encrypted cloud storage",
      href: "/taucloud",
    },
    {
      name: "Tau Mail",
      tag: "End-to-end encrypted email",
      href: "/taumail",
    },
    {
      name: "Tau ID",
      tag: "Decentralized identity and credentials",
      href: "/tauid",
    },
    {
      name: "Tau AI",
      tag: "On-device AI that serves you, not advertisers",
      href: "/tauai",
    },
    {
      name: "Tau Store",
      tag: "Privacy-scored app marketplace",
      href: "/taustore",
    },
    {
      name: "Tau Script",
      tag: "Native automation for TauOS",
      href: "/tauscript",
    },
  ],

  footer: {
    blurb:
      "Privacy-first, AI-native operating system ecosystem. Zero telemetry. Your data stays yours.",
    products: [
      { label: "Tau OS Desktop", href: "/desktop" },
      { label: "Tau Mobile", href: "/mobile" },
      { label: "Tau Mail", href: "/taumail" },
      { label: "Tau Cloud", href: "/taucloud" },
      { label: "Tau AI", href: "/tauai" },
    ],
    developers: [
      { label: "Documentation", href: "/docs" },
      { label: "Developer Hub", href: "/developers" },
      { label: "API Reference", href: "/docs/api" },
      { label: "TauScript", href: "/tauscript" },
    ],
    company: [
      { label: "About", href: "/about" },
      { label: "Beta Program", href: "/beta" },
      { label: "Governance", href: "/governance" },
      { label: "Legal", href: "/legal" },
      { label: "Privacy", href: "/legal/privacy" },
      { label: "Contact", href: "/contact" },
    ],
    legal: [
      { label: "Security Whitepaper", href: "/documents/legal/tauos-security-whitepaper.html" },
      { label: "Data Protection", href: "/documents/legal/tauos-data-protection-addendum.html" },
      { label: "Sub-processors", href: "/documents/legal/tauos-sub-processor-list.html" },
    ],
  },

  values: [
    {
      title: "Privacy First",
      description: "Privacy isn't just a feature—it's the foundation of everything we build.",
    },
    {
      title: "Zero Telemetry",
      description: "No tracking, no data mining, no silent exfiltration. Ever.",
    },
    {
      title: "User Sovereignty",
      description: "You own your data, your keys, and your digital identity.",
    },
    {
      title: "Open & Auditable",
      description: "Transparent security practices and community-driven governance.",
    },
  ],
} as const;

export type SiteContent = typeof site;
