#!/usr/bin/env node
/**
 * Tau CLI v1.0 — primary developer entry point
 * Usage: npx tsx scripts/tau-cli.ts <command> [args]
 */
import fs from 'fs';
import path from 'path';
import {
  compile, format, lint, runTests, generateDocs, run, TAUSCRIPT_VERSION,
} from '../src/lib/tauscript/index';
import {
  parseManifest, stringifyManifest, createDefaultManifest, resolveDependencies,
  searchPackages, BUILTIN_REGISTRY,
} from '../src/lib/taupm/index';

const args = process.argv.slice(2);
const cmd = args[0];
const cwd = process.cwd();

function readFile(p: string) {
  return fs.readFileSync(path.resolve(cwd, p), 'utf-8');
}

function writeFile(p: string, content: string) {
  fs.mkdirSync(path.dirname(path.resolve(cwd, p)), { recursive: true });
  fs.writeFileSync(path.resolve(cwd, p), content);
}

function findMainFile(): string {
  if (fs.existsSync(path.join(cwd, 'main.tau'))) return 'main.tau';
  if (fs.existsSync(path.join(cwd, 'src/main.tau'))) return 'src/main.tau';
  const manifest = path.join(cwd, 'taupm.toml');
  if (fs.existsSync(manifest)) {
    const m = parseManifest(readFile('taupm.toml'));
    if (m.main && fs.existsSync(path.join(cwd, m.main))) return m.main;
  }
  return 'main.tau';
}

const commands: Record<string, () => void | Promise<void>> = {
  version: () => console.log(`TauScript v${TAUSCRIPT_VERSION}`),

  help: () => {
    console.log(`Tau CLI v${TAUSCRIPT_VERSION}
Commands:
  tau new <name>       Create new project
  tau init             Initialize taupm.toml
  tau run [file]       Run TauScript file
  tau build [file]     Compile to IR
  tau compile [file]   Compile to JavaScript
  tau test [file]      Run tests
  tau fmt [file]       Format source
  tau lint [file]      Lint source
  tau doc [file]       Generate documentation
  tau clean            Remove build artifacts
  tau doctor           Check environment
  tau publish          Publish package (registry)
  tau help             Show this help`);
  },

  new: () => {
    const name = args[1] ?? 'my-project';
    fs.mkdirSync(path.join(cwd, name), { recursive: true });
    process.chdir(path.join(cwd, name));
    writeFile('taupm.toml', stringifyManifest(createDefaultManifest(name)));
    writeFile('main.tau', `print("Hello from ${name}!");\n`);
    writeFile('tests/main.test.tau', `fn test_hello() {\n  print("ok");\n}\n`);
    console.log(`Created project '${name}'`);
  },

  init: () => {
    const name = path.basename(cwd);
    writeFile('taupm.toml', stringifyManifest(createDefaultManifest(name)));
    console.log('Created taupm.toml');
  },

  run: () => {
    const file = args[1] ?? findMainFile();
    const source = readFile(file);
    const result = run(source);
    if (result.output) console.log(result.output);
    if (result.error) { console.error(result.error); process.exit(1); }
    if (result.result !== undefined && result.result !== null) console.log(result.result);
  },

  build: () => {
    const file = args[1] ?? findMainFile();
    const result = compile(readFile(file), { target: 'ir', optimize: true });
    if (!result.success) { console.error(result.error); process.exit(1); }
    writeFile('dist/main.ir', result.output ?? '');
    console.log('Built dist/main.ir');
  },

  compile: () => {
    const file = args[1] ?? findMainFile();
    const result = compile(readFile(file), { target: 'js', optimize: true });
    if (!result.success) { console.error(result.error); process.exit(1); }
    writeFile('dist/main.js', result.output ?? '');
    console.log('Compiled dist/main.js');
  },

  test: () => {
    const file = args[1] ?? 'tests/main.test.tau';
    const source = fs.existsSync(path.resolve(cwd, file)) ? readFile(file) : readFile(findMainFile());
    const result = runTests(source);
    result.tests.forEach((t) => console.log(`${t.passed ? '✓' : '✗'} ${t.name}${t.error ? ` — ${t.error}` : ''}`));
    console.log(`\n${result.passed}/${result.total} passed · Coverage ${result.coverage.percent}%`);
    if (result.failed) process.exit(1);
  },

  fmt: () => {
    const file = args[1] ?? findMainFile();
    const formatted = format(readFile(file));
    writeFile(file, formatted);
    console.log(`Formatted ${file}`);
  },

  lint: () => {
    const file = args[1] ?? findMainFile();
    const result = lint(readFile(file));
    result.diagnostics.forEach((d) => console.log(`${d.severity} [${d.line}:${d.column}] ${d.message}`));
    console.log(`\nQuality score: ${result.score}/100`);
    if (result.diagnostics.some((d) => d.severity === 'error')) process.exit(1);
  },

  doc: () => {
    const file = args[1] ?? findMainFile();
    const docs = generateDocs(readFile(file), path.basename(file, '.tau'));
    writeFile('docs/API.md', docs.markdown);
    writeFile('docs/API.html', docs.html);
    console.log('Generated docs/API.md and docs/API.html');
  },

  clean: () => {
    ['dist', 'docs/API.md', 'docs/API.html', 'taupm.lock'].forEach((p) => {
      const full = path.resolve(cwd, p);
      if (fs.existsSync(full)) {
        fs.rmSync(full, { recursive: true });
        console.log(`Removed ${p}`);
      }
    });
  },

  doctor: () => {
    console.log(`TauScript: v${TAUSCRIPT_VERSION}`);
    console.log(`Node: ${process.version}`);
    console.log(`CWD: ${cwd}`);
    console.log(`taupm.toml: ${fs.existsSync('taupm.toml') ? 'found' : 'missing'}`);
    console.log(`main.tau: ${fs.existsSync('main.tau') ? 'found' : 'missing'}`);
    console.log('Status: OK');
  },

  publish: () => {
    const manifest = fs.existsSync('taupm.toml') ? parseManifest(readFile('taupm.toml')) : createDefaultManifest(path.basename(cwd));
    console.log(`Publishing ${manifest.name}@${manifest.version} to registry...`);
    console.log('(Registry upload architecture ready — connect TAUPM_REGISTRY in production)');
  },
};

// taupm subcommands via tau pm ...
if (cmd === 'pm' || cmd === 'taupm') {
  const sub = args[1];
  const pmCommands: Record<string, () => void> = {
    init: commands.init,
    install: () => {
      const manifest = parseManifest(readFile('taupm.toml'));
      const lock = resolveDependencies(manifest, BUILTIN_REGISTRY);
      writeFile('taupm.lock', JSON.stringify(lock, null, 2));
      console.log(`Installed ${Object.keys(lock.packages).length} packages`);
    },
    search: () => {
      const q = args[2] ?? '';
      searchPackages(q, BUILTIN_REGISTRY).forEach((p) => console.log(`${p.name}@${p.version} — ${p.description}`));
    },
    login: () => console.log('Logged in to Tau Package Registry (stub)'),
    logout: () => console.log('Logged out'),
  };
  (pmCommands[sub] ?? (() => console.log('Usage: tau pm init|install|search|login|logout')))();
} else {
  (commands[cmd ?? 'help'] ?? commands.help)();
}
