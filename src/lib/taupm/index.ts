/** TauPM — TauScript Package Manager v1.0 */

export type TaupmManifest = {
  name: string;
  version: string;
  description?: string;
  main?: string;
  author?: string;
  license?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
};

export type LockEntry = {
  name: string;
  version: string;
  resolved: string;
  integrity?: string;
};

export type LockFile = {
  lockfileVersion: 1;
  packages: Record<string, LockEntry>;
};

export type PackageInfo = {
  name: string;
  version: string;
  description: string;
  downloads?: number;
};

const REGISTRY_URL = process.env.TAUPM_REGISTRY ?? 'https://registry.tauos.dev';

export function parseManifest(toml: string): TaupmManifest {
  const manifest: TaupmManifest = { name: '', version: '0.1.0' };
  let section = '';
  for (const line of toml.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const secMatch = trimmed.match(/^\[(.+)\]$/);
    if (secMatch) { section = secMatch[1]; continue; }
    const kv = trimmed.match(/^(\w+)\s*=\s*"(.*)"/);
    if (!kv) continue;
    const [, key, val] = kv;
    if (section === 'dependencies' || section === 'devDependencies') {
      if (!manifest[section as 'dependencies']) manifest[section as 'dependencies'] = {};
      manifest[section as 'dependencies']![key] = val;
    } else if (key in manifest || ['name', 'version', 'description', 'main', 'author', 'license'].includes(key)) {
      (manifest as unknown as Record<string, string>)[key] = val;
    }
  }
  return manifest;
}

export function stringifyManifest(m: TaupmManifest): string {
  const lines = [
    `[package]`,
    `name = "${m.name}"`,
    `version = "${m.version}"`,
    m.description ? `description = "${m.description}"` : '',
    m.main ? `main = "${m.main}"` : '',
    m.author ? `author = "${m.author}"` : '',
    m.license ? `license = "${m.license}"` : '',
  ].filter(Boolean);
  if (m.dependencies && Object.keys(m.dependencies).length) {
    lines.push('', '[dependencies]');
    Object.entries(m.dependencies).forEach(([k, v]) => lines.push(`${k} = "${v}"`));
  }
  return lines.join('\n') + '\n';
}

export function satisfiesVersion(required: string, actual: string): boolean {
  if (required.startsWith('^')) {
    const major = required.slice(1).split('.')[0];
    return actual.split('.')[0] === major;
  }
  if (required.startsWith('~')) {
    const parts = required.slice(1).split('.');
    return actual.startsWith(`${parts[0]}.${parts[1]}`);
  }
  return required === actual;
}

export function resolveDependencies(manifest: TaupmManifest, registry: PackageInfo[] = []): LockFile {
  const packages: Record<string, LockEntry> = {};
  const deps = { ...manifest.dependencies, ...manifest.devDependencies };

  for (const [name, range] of Object.entries(deps ?? {})) {
    const match = registry.find((p) => p.name === name && satisfiesVersion(range, p.version))
      ?? { name, version: range.replace(/[\^~]/, ''), description: '' };
    packages[name] = {
      name,
      version: match.version,
      resolved: `${REGISTRY_URL}/${name}/${match.version}`,
    };
  }

  return { lockfileVersion: 1, packages };
}

export function createDefaultManifest(name: string): TaupmManifest {
  return {
    name,
    version: '0.1.0',
    description: 'A TauScript package',
    main: 'main.tau',
    license: 'MIT',
    dependencies: {},
  };
}

export function searchPackages(query: string, registry: PackageInfo[] = BUILTIN_REGISTRY): PackageInfo[] {
  const q = query.toLowerCase();
  return registry.filter((p) => p.name.includes(q) || p.description.toLowerCase().includes(q));
}

export const BUILTIN_REGISTRY: PackageInfo[] = [
  { name: 'tau-http', version: '1.0.0', description: 'HTTP client for TauScript', downloads: 1200 },
  { name: 'tau-json', version: '1.0.0', description: 'JSON utilities', downloads: 980 },
  { name: 'tau-cli', version: '1.0.0', description: 'CLI helpers', downloads: 750 },
  { name: 'tau-test', version: '1.0.0', description: 'Testing utilities', downloads: 620 },
  { name: 'tau-auth', version: '0.9.0', description: 'Authentication helpers', downloads: 410 },
];
