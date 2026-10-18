const assert = require('node:assert/strict');
const { test } = require('node:test');
const { parseOptions, ensureAccount, preflight, verifyGitIdentity, verifyCommit } = require('../scripts/publish-brew');

const owner = 'Rafiya1207';
const email = '157607173+Rafiya1207@users.noreply.github.com';

test('publishing requires a stable version and accepts an offline dry run', () => {
  assert.deepEqual(parseOptions(['1.0.1', '--dry-run']), { version: '1.0.1', dryRun: true });
  assert.deepEqual(parseOptions(['2.0.0']), { version: '2.0.0', dryRun: false });
  assert.deepEqual(parseOptions(['--help']), { help: true });
  for (const args of [[], ['../other'], ['01.0.0'], ['1.0.0-beta'], ['1.0.1', '--force'], ['1.0.1', '--dry-run', '--dry-run']]) {
    assert.throws(() => parseOptions(args), /Usage:/);
  }
});

test('the work account is rejected before any other GitHub request', () => {
  const calls = [];
  const command = (program, args) => {
    calls.push([program, args]);
    return JSON.stringify({ login: 'shaikrafiya-fs', id: 1 });
  };
  assert.throws(() => preflight(command, 'guess-odd-char-v1.0.1'), /Refusing to publish as shaikrafiya-fs/);
  assert.deepEqual(calls, [['gh', ['api', 'user']]]);
});

test('the publishing account must match both login and account ID', () => {
  assert.doesNotThrow(() => ensureAccount(() => JSON.stringify({ login: owner, id: 157607173 })));
  assert.throws(() => ensureAccount(() => JSON.stringify({ login: owner, id: 123 })), /Refusing to publish/);
});

function githubFixture({ existingRelease = false, existingTag = false, failure } = {}) {
  return (program, args) => {
    assert.equal(program, 'gh');
    assert.equal(args[0], 'api');
    const endpoint = args[1];
    if (endpoint === 'user') return JSON.stringify({ login: owner, id: 157607173 });
    if (endpoint.endsWith('/experiments') || endpoint.endsWith('/homebrew-games')) {
      return JSON.stringify({ full_name: endpoint.slice(6), owner: { login: owner }, permissions: { push: true }, private: false, default_branch: 'main' });
    }
    if (failure) throw Object.assign(new Error('API failed'), { stderr: failure });
    if (endpoint.includes('/releases/') && existingRelease) return JSON.stringify({ id: 123 });
    if (endpoint.includes('/git/ref/') && existingTag) return JSON.stringify({ object: { sha: 'abc' } });
    throw Object.assign(new Error('Not found'), { stderr: 'gh: Not Found (HTTP 404)' });
  };
}

test('existing releases and orphaned tags cannot be overwritten', () => {
  assert.throws(() => preflight(githubFixture({ existingRelease: true }), 'guess-odd-char-v1.0.0'), /already exists/);
  assert.throws(() => preflight(githubFixture({ existingTag: true }), 'guess-odd-char-v1.0.0'), /already exists/);
  assert.doesNotThrow(() => preflight(githubFixture(), 'guess-odd-char-v1.0.1'));
});

test('a network error is not mistaken for an unused release version', () => {
  assert.throws(() => preflight(githubFixture({ failure: 'connection timeout' }), 'guess-odd-char-v1.0.1'), /API failed/);
});

test('both effective author and committer must match the personal identity', () => {
  const git = (cwd, args) => args[1] === 'GIT_COMMITTER_IDENT'
    ? 'shaikrafiya-fs <work@example.com> 123 +0530'
    : `${owner} <${email}> 123 +0530`;
  assert.throws(() => verifyGitIdentity(git, '/repo'), /GIT_COMMITTER_IDENT/);
  assert.doesNotThrow(() => verifyGitIdentity(() => `${owner} <${email}> 123 +0530`, '/repo'));
});

test('correct authentication cannot hide a commit with the wrong author or committer', () => {
  assert.doesNotThrow(() => verifyCommit(() => [owner, email, owner, email].join('\n'), '/repo'));
  assert.throws(() => verifyCommit(() => ['shaikrafiya-fs', email, owner, email].join('\n'), '/repo'), /Incorrect commit/);
  assert.throws(() => verifyCommit(() => [owner, email, 'shaikrafiya-fs', email].join('\n'), '/repo'), /Incorrect commit/);
});
