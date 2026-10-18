const assert = require('node:assert/strict');
const { spawn, spawnSync } = require('node:child_process');
const path = require('node:path');
const { test } = require('node:test');
const { version } = require('../package.json');

const script = path.resolve(__dirname, '../guess_odd_char.js');
const run = (args = [], input = '') => spawnSync(process.execPath, [script, ...args], {
  input, encoding: 'utf8', timeout: 5000
});

test('help and version work without starting the game', () => {
  const help = run(['--help']);
  assert.equal(help.status, 0);
  assert.match(help.stdout, /Usage: guess-odd-char/);
  assert.doesNotMatch(help.stdout, /Enter odd character/);
  assert.equal(run(['--version']).stdout.trim(), version);
  assert.equal(run(['--unknown']).status, 1);
});

test('a wrong answer ends the game with score zero', () => {
  const result = run([], '?\n');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Score: 0/);
  assert.match(result.stdout, /👎🏻/);
});

test('end of input exits cleanly', () => {
  const result = run();
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Score: 0/);
  assert.doesNotMatch(result.stderr, /Error/);
});

test('correct guesses advance rounds and accumulate in order', { timeout: 5000 }, async () => {
  const child = spawn(process.execPath, [script], { stdio: ['pipe', 'pipe', 'pipe'] });
  let output = '';
  let pending = '';
  let expected = '';
  let rounds = 0;
  let failure;
  let stderr = '';
  child.stderr.on('data', chunk => { stderr += chunk; });
  child.stdout.on('data', chunk => {
    output += chunk;
    pending += chunk;
    if (!pending.includes('Enter odd character: ')) return;
    try {
      const rows = pending.split('\n').filter(line => /^[A-Z]{20}$/.test(line));
      assert.equal(rows.length, 20);
      const counts = {};
      for (const char of rows.join('')) counts[char] = (counts[char] || 0) + 1;
      const odd = Object.keys(counts).filter(char => counts[char] === 1);
      assert.equal(odd.length, 1);
      expected += odd[0];
      pending = '';
      rounds += 1;
      child.stdin.write(rounds <= 2 ? `${expected.toLowerCase()}\n` : '?\n');
    } catch (error) {
      failure = error;
      child.kill();
    }
  });
  try {
    const code = await new Promise((resolve, reject) => {
      child.on('error', reject);
      child.on('close', resolve);
    });
    if (failure) throw failure;
    assert.equal(code, 0, stderr);
    assert.equal(rounds, 3);
    assert.match(output, /Score: 2/);
    assert.ok(output.endsWith(`${expected}\n`));
  } finally {
    child.kill();
  }
});
