const { createHash } = require('node:crypto');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { pathToFileURL } = require('node:url');

const root = path.resolve(__dirname, '..');
const { name, version } = require('../package.json');
const dist = path.join(root, 'dist');
const archive = path.join(dist, `${name}-${version}.tar.gz`);
const staging = fs.mkdtempSync(path.join(os.tmpdir(), `${name}-`));

try {
  const directory = `${name}-${version}`;
  const source = path.join(staging, directory);
  fs.mkdirSync(source);
  for (const file of ['guess_odd_char.js', 'package.json', 'README.md']) {
    fs.copyFileSync(path.join(root, file), path.join(source, file));
  }
  fs.chmodSync(path.join(source, 'guess_odd_char.js'), 0o755);
  fs.mkdirSync(path.join(dist, 'Formula'), { recursive: true });
  execFileSync('tar', ['-czf', archive, '-C', staging, directory], {
    env: { ...process.env, COPYFILE_DISABLE: '1' }
  });

  const sha256 = createHash('sha256').update(fs.readFileSync(archive)).digest('hex');
  const url = process.env.HOMEBREW_SOURCE_URL || pathToFileURL(archive).href;
  if (process.env.HOMEBREW_SOURCE_URL && !url.startsWith('https://')) {
    throw new Error('HOMEBREW_SOURCE_URL must be an HTTPS URL for the generated archive.');
  }
  // Ruby double-quoted strings also interpolate #, unlike JSON strings.
  const rubyString = value => JSON.stringify(value).replace(/#/g, '\\#');
  const substitutions = { URL: url, VERSION: version, SHA256: sha256 };
  const formula = fs.readFileSync(path.join(root, 'packaging/guess-odd-char.rb.in'), 'utf8')
    .replace(/@(URL|VERSION|SHA256)@/g, (_, key) => rubyString(substitutions[key]));
  const formulaPath = path.join(dist, 'Formula', `${name}.rb`);
  fs.writeFileSync(formulaPath, formula);
  fs.writeFileSync(`${archive}.sha256`, `${sha256}  ${path.basename(archive)}\n`);
  console.log(`Archive: ${archive}\nFormula: ${formulaPath}\nSHA-256: ${sha256}`);
} finally {
  fs.rmSync(staging, { recursive: true, force: true });
}
