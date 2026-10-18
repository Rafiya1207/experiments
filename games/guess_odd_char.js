#!/usr/bin/env node

const { createInterface } = require('node:readline');
const { version } = require('./package.json');

const BOARD_SIZE = 20;
const ODD_CHARS = [];

const PAIRS = [
  ['M', 'W'], ['P', 'R'], ['B', 'D'], ['V', 'U'],
  ['D', 'O'], ['J', 'L'], ['C', 'G'], ['E', 'F'],
  ['A', 'V'], ['S', 'Z'], ['O', 'Q'], ['K', 'X']
];
const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function randomNumber(range) {
  return Math.floor(Math.random() * range);
}

function generateRow(row, columns, chars) {
  let rowPattern = [];

  for (let column = 0; column < columns; column++) {
    rowPattern.push(chars[(row + column) % 2]);
  }

  return rowPattern;
}

function confusionBoard(size, chars) {
  let pattern = [];
  const rows = size;
  const columns = size;

  for (let row = 0; row < rows; row++) {
    pattern.push(generateRow(row, columns, chars));
  }

  return pattern;
}

function encodeChar(char, alphabets) {
  const key = randomNumber(10);
  const position = (alphabets.indexOf(char) + key) % alphabets.length;

  return alphabets[position];
}

function pickOddChar(pair, alphabets) {
  const oddChar = encodeChar(pair[0], alphabets);

  if (pair[1] === oddChar || pair[0] === oddChar) {
    return alphabets[(alphabets.indexOf(pair[0]) + alphabets.indexOf(pair[1])) % alphabets.length];
  }
  return oddChar;
}

function generateRandomCell(boardSize) {
  const row = randomNumber(boardSize - 1);
  const column = randomNumber(boardSize - 1);

  return [row, column];
}

function boardToPattern(board) {
  const pattern = [];

  for (let row = 0; row < board.length; row++) {
    pattern.push(board[row].join(''));
  }

  return pattern.join('\n');
}

function createOddCharBoard(PAIRS, ALPHABETS, BOARD_SIZE) {
  const pairIndex = randomNumber(PAIRS.length);
  const pair = PAIRS[pairIndex];
  const currentOddChar = pickOddChar(pair, ALPHABETS);
  ODD_CHARS.push(currentOddChar);
  const randomCell = generateRandomCell(BOARD_SIZE);
  const board = confusionBoard(BOARD_SIZE, pair);
  const randomRow = randomCell[0];
  const randomCol = randomCell[1];

  board[randomRow][randomCol] = currentOddChar;

  return [board, currentOddChar];
}

async function askForGuess(answers) {
  process.stdout.write('Enter odd character: ');
  const response = await answers.next();
  return response.done ? null : response.value.trim().toUpperCase();
}

function checkGuess(expected, guessed) {
  return expected === guessed;
}

async function playRound(answers) {
  const oddCharBoard = createOddCharBoard(PAIRS, ALPHABETS, BOARD_SIZE);
  const board = oddCharBoard[0];
  const oddChar = ODD_CHARS.join('');

  const pattern = boardToPattern(board);

  console.log(pattern);
  const response = await askForGuess(answers);
  if (response === null) {
    console.log('\nScore:', ODD_CHARS.length - 1);
    return false;
  }
  const isCorrect = checkGuess(oddChar, response);
  if (process.stdout.isTTY) console.clear();
  const symbol = isCorrect ? '👍🏻' : '👎🏻';
  console.log(symbol);

  if (!isCorrect) {
    console.log('Score:', ODD_CHARS.length - 1);
    console.log(oddChar);
    return false;
  }
  return true;
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && ['--version', '-v'].includes(args[0])) {
    console.log(version);
    return;
  }
  if (args.length > 0) {
    const help = args.length === 1 && ['--help', '-h'].includes(args[0]);
    console[help ? 'log' : 'error'](
      'Usage: guess-odd-char [--help | --version]\n\n' +
      'Find the odd character in each board. Enter all odd characters found\n' +
      'so far, in order. A wrong guess ends the game. Press Ctrl-D to quit.'
    );
    if (!help) process.exitCode = 1;
    return;
  }

  const input = createInterface({ input: process.stdin, crlfDelay: Infinity });
  try {
    const answers = input[Symbol.asyncIterator]();
    while (await playRound(answers)) {
      // Keep playing until an incorrect guess or end of input.
    }
  } finally {
    input.close();
  }
}

main().catch(error => {
  console.error(error.message);
  process.exitCode = 1;
});
