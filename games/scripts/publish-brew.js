#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const OWNER = 'Rafiya1207';
const ACCOUNT_ID = 157607173;
const EMAIL = `${ACCOUNT_ID}+${OWNER}@users.noreply.github.com`;
const SOURCE = `${OWNER}/experiments`;
const TAP = `${OWNER}/homebrew-games`;
const ROOT = path.resolve(__dirname, '..');
const FILES = [
  'guess_odd_char.js', 'package.json', 'package-lock.json', 'README.md', '.gitignore',
  'packaging/guess-odd-char.rb.in', 'scripts/package-brew.js', 'scripts/publish-brew.js',
  'tests/guess-odd-char.test.js', 'tests/publish-brew.test.js'
];
const HELP = `Usage: npm run publish:brew -- VERSION [--dry-run]

Example: npm run publish:brew -- 1.0.1
Preview: npm run publish:brew -- 1.0.1 --dry-run

Publishes the current guess_odd_char.js to ${SOURCE} and ${TAP}.
Only ${OWNER} may publish. VERSION must be a new stable version (X.Y.Z).
--dry-run builds and tests locally without contacting GitHub or publishing.
`;

function parseOptions(args) {
  if (args.length === 1 && ['--help', '-h'].includes(args[0])) return { help: true };
  const versions = args.filter(arg => !arg.startsWith('-'));
  const flags = args.filter(arg => arg.startsWith('-'));
  if (versions.length !== 1 || flags.some(flag => flag !== '--dry-run') ||
      new Set(flags).size !== flags.length ||
      !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(versions[0])) {
    throw new Error(HELP);
  }
  return { version: versions[0], dryRun: flags.includes('--dry-run') };
}

function run(program, args, options = {}) {
  try {
    return execFileSync(program, args, {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...options
    }).trim();
  } catch (error) {
    // Keep the exit status for expected GitHub 404 and git diff results.
    error.message = `${program} failed: ${error.stderr?.toString().trim() || error.message}`;
    throw error;
  }
}

function api(command, endpoint, optional = false) {
  try {
    return JSON.parse(command('gh', ['api', endpoint]));
  } catch (error) {
    if (optional && /\(HTTP 404\)/.test(error.stderr?.toString() || '')) return null;
    throw error;
  }
}

function ensureAccount(command) {
  const user = api(command, 'user');
  if (user.login !== OWNER || user.id !== ACCOUNT_ID) {
    throw new Error(`Refusing to publish as ${user.login}. Run: gh auth switch --hostname github.com --user ${OWNER}`);
  }
}

function preflight(command, tag) {
  ensureAccount(command);
  const source = api(command, `repos/${SOURCE}`);
  const tap = api(command, `repos/${TAP}`);
  for (const repository of [source, tap]) {
    if (repository.owner?.login !== OWNER || !repository.permissions?.push || repository.private ||
        !repository.default_branch) {
      throw new Error(`Expected a public, writable ${OWNER} repository: ${repository.full_name}`);
    }
  }
  if (api(command, `repos/${SOURCE}/releases/tags/${tag}`, true) ||
      api(command, `repos/${SOURCE}/git/ref/tags/${tag}`, true)) {
    throw new Error(`${tag} already exists. Choose a new version; existing releases are never overwritten.`);
  }
  return { source, tap };
}

function verifyGitIdentity(git, cwd) {
  for (const variable of ['GIT_AUTHOR_IDENT', 'GIT_COMMITTER_IDENT']) {
    if (!git(cwd, ['var', variable]).startsWith(`${OWNER} <${EMAIL}> `)) {
      throw new Error(`Incorrect ${variable}; refusing to commit or push.`);
    }
  }
}

function verifyCommit(git, cwd) {
  const identity = git(cwd, ['log', '-1', '--format=%an%n%ae%n%cn%n%ce']).split('\n');
  if (JSON.stringify(identity) !== JSON.stringify([OWNER, EMAIL, OWNER, EMAIL])) {
    throw new Error(`Incorrect commit author or committer in ${cwd}; refusing to push.`);
  }
}

function main(args, command = run) {
  const options = parseOptions(args);
  if (options.help) return console.log(HELP);
  const { version, dryRun } = options;
  const name = require('../package.json').name;
  const tag = `${name}-v${version}`;
  const url = `https://github.com/${SOURCE}/releases/download/${tag}/${name}-${version}.tar.gz`;
  const env = {
    ...process.env, GH_HOST: 'github.com', GIT_TERMINAL_PROMPT: '0',
    GIT_AUTHOR_NAME: OWNER, GIT_AUTHOR_EMAIL: EMAIL,
    GIT_COMMITTER_NAME: OWNER, GIT_COMMITTER_EMAIL: EMAIL
  };
  const execute = (program, argv, extra = {}) => command(program, argv, { env, ...extra });
  const git = (cwd, argv) => execute('git', [
    '-c', `user.name=${OWNER}`, '-c', `user.email=${EMAIL}`,
    '-c', 'credential.helper=', '-c', 'credential.helper=!gh auth git-credential',
    '-c', `credential.https://github.com.username=${OWNER}`, ...argv
  ], { cwd });

  // Complete all remote checks before creating commits or changing remote state.
  const repositories = dryRun ? null : preflight(execute, tag);
  fs.mkdirSync(path.join(ROOT, 'dist'), { recursive: true });
  const workspace = fs.mkdtempSync(path.join(ROOT, 'dist', 'publish-brew-'));
  console.log(`Artifacts and isolated checkouts: ${workspace}`);

  try {
    const source = path.join(workspace, 'experiments');
    const tap = path.join(workspace, 'homebrew-games');
    const game = path.join(source, 'games');
    if (dryRun) {
      fs.mkdirSync(game, { recursive: true });
    } else {
      for (const [repository, destination] of [[repositories.source, source], [repositories.tap, tap]]) {
        console.log(`Cloning ${repository.full_name}...`);
        git(workspace, ['clone', '--single-branch', '--branch', repository.default_branch,
          '--', `https://${OWNER}@github.com/${repository.full_name}.git`, destination]);
        git(destination, ['config', '--local', 'user.name', OWNER]);
        git(destination, ['config', '--local', 'user.email', EMAIL]);
        git(destination, ['config', '--local', 'credential.helper', '']);
        git(destination, ['config', '--local', '--add', 'credential.helper', '!gh auth git-credential']);
        git(destination, ['config', '--local', 'credential.https://github.com.username', OWNER]);
        verifyGitIdentity(git, destination);
      }
    }

    for (const file of FILES) {
      const destination = path.join(game, file);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.copyFileSync(path.join(ROOT, file), destination);
    }
    const manifest = JSON.parse(fs.readFileSync(path.join(game, 'package.json'), 'utf8'));
    manifest.version = version;
    fs.writeFileSync(path.join(game, 'package.json'), `${JSON.stringify(manifest, null, 2)}\n`);
    const lock = JSON.parse(fs.readFileSync(path.join(game, 'package-lock.json'), 'utf8'));
    lock.version = version;
    lock.packages[''].version = version;
    fs.writeFileSync(path.join(game, 'package-lock.json'), `${JSON.stringify(lock, null, 2)}\n`);

    console.log('Testing the current game and publishing guards...');
    console.log(execute(process.execPath, ['--test', 'tests/guess-odd-char.test.js', 'tests/publish-brew.test.js'], { cwd: game }));
    console.log(execute(process.execPath, ['scripts/package-brew.js'], {
      cwd: game, env: { ...env, HOMEBREW_SOURCE_URL: url }
    }));
    const archive = path.join(game, 'dist', `${name}-${version}.tar.gz`);
    const formula = path.join(game, 'dist', 'Formula', `${name}.rb`);
    console.log(execute('ruby', ['-c', formula]));

    if (dryRun) {
      console.log(`Dry run passed. No GitHub requests, commits, pushes, or releases were made.\nPlanned release: ${tag}\nPlanned account: ${OWNER}\nArchive: ${archive}\nFormula: ${formula}`);
      return;
    }

    git(source, ['add', '--', ...FILES.map(file => `games/${file}`)]);
    git(source, ['diff', '--cached', '--check']);
    verifyGitIdentity(git, source);
    console.log(git(source, ['commit', '-m', `Release ${name} ${version}`]));
    verifyCommit(git, source);
    const sourceCommit = git(source, ['rev-parse', 'HEAD']);

    fs.mkdirSync(path.join(tap, 'Formula'), { recursive: true });
    fs.copyFileSync(formula, path.join(tap, 'Formula', `${name}.rb`));
    git(tap, ['add', '--', `Formula/${name}.rb`]);
    git(tap, ['diff', '--cached', '--check']);
    verifyGitIdentity(git, tap);
    console.log(git(tap, ['commit', '-m', `Release ${name} ${version}`]));
    verifyCommit(git, tap);
    const tapCommit = git(tap, ['rev-parse', 'HEAD']);

    const notes = path.join(workspace, 'release-notes.md');
    fs.writeFileSync(notes, `Guess Odd Char ${version}\n\nInstall:\n\n\`\`\`sh\nbrew install rafiya1207/games/${name}\n${name}\n\`\`\`\n\nSource commit: ${sourceCommit}\n`);

    console.log('Pushing the source commit...');
    ensureAccount(execute);
    verifyCommit(git, source);
    git(source, ['push', 'origin', `HEAD:refs/heads/${repositories.source.default_branch}`]);
    console.log('Publishing the release archive...');
    ensureAccount(execute);
    console.log(execute('gh', ['release', 'create', tag, archive, `${archive}.sha256`,
      '--repo', SOURCE, '--target', sourceCommit, '--title', `Guess Odd Char ${version}`, '--notes-file', notes]));
    console.log('Pushing the Homebrew formula...');
    ensureAccount(execute);
    verifyCommit(git, tap);
    git(tap, ['push', 'origin', `HEAD:refs/heads/${repositories.tap.default_branch}`]);

    for (const [repository, sha] of [[SOURCE, sourceCommit], [TAP, tapCommit]]) {
      const commit = api(execute, `repos/${repository}/commits/${sha}`);
      if (commit.author?.login !== OWNER || commit.committer?.login !== OWNER) {
        throw new Error(`GitHub attribution verification failed for ${repository}/${sha}.`);
      }
    }
    const release = api(execute, `repos/${SOURCE}/releases/tags/${tag}`);
    if (release.author?.login !== OWNER || release.draft ||
        release.assets.length !== 2 || release.assets.some(asset => asset.uploader?.login !== OWNER)) {
      throw new Error('GitHub release account or asset verification failed.');
    }
    console.log(`Published as ${OWNER}: ${release.html_url}\nInstall: brew install rafiya1207/games/${name}`);
  } catch (error) {
    throw new Error(`${error.message}\nFiles and checkouts retained at: ${workspace}\nCompleted pushes/releases are not automatically rolled back. Inspect GitHub before retrying.`);
  }
}

module.exports = { parseOptions, ensureAccount, preflight, verifyGitIdentity, verifyCommit };

if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
