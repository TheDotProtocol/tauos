import fs from 'fs';

const marketingDir = 'src/components/marketing';
const shell = `${marketingDir}/MarketingPageShell.tsx`;

if (!fs.existsSync(shell)) {
  console.error('[deploy-check] MISSING', shell);
  process.exit(1);
}

console.log('[deploy-check]', marketingDir, fs.readdirSync(marketingDir).length, 'files');
