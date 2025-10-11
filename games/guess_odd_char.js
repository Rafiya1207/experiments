const BOARD_SIZE = 15;
const PAIRS = [
  ['M', 'W'], ['P', 'R'], ['B', 'D'], ['V', 'U'],
  ['0', 'O'], ['J', 'L'], ['C', 'G'], ['E', 'F'],
  ['A', 'V'], ['Z', 'S'], ['Q', 'O'], ['K', 'X']
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

  return rowPattern.join(' ');
}

function confusionPattern(size, chars) {
  let pattern = [];
  const rows = size;
  const columns = size;

  for (let row = 0; row < rows; row++) {
    pattern.push(generateRow(row, columns, chars));
  }

  return pattern.join('\n');
}

function encodeChar(char, alphabets) {
  const key = randomNumber(10);
  const position = (alphabets.indexOf(char) + key) % alphabets.length;

  return alphabets[position];
}

function pickOddChar(pair, alphabets) {
  const oddChar = encodeChar(pair[0], alphabets);

  if (pair.join('').includes(oddChar)) {
    return alphabets.indexOf(oddChar) + 1;
  }
  return oddChar;
}

function main() {
  const pairIndex = randomNumber(PAIRS.length);
  const pair = PAIRS[pairIndex];
  const oddChar = pickOddChar(pair, ALPHABETS);

  console.log(oddChar);

  console.log((confusionPattern(BOARD_SIZE, pair)));
}

main();
