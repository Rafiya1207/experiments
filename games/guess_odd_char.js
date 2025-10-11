const BOARD_SIZE = 15;
const CHARS = [
  ['M', 'W'], ['P', 'R'], ['B', 'D'], ['V', 'U'],
  ['0', 'O'], ['J', 'L'], ['C', 'G'], ['E', 'F'],
  ['A', 'V'], ['Z', 'S'], ['Q', 'O'], ['K', 'X']
];

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

function pickPair(pairs) {
  const pairIndex = Math.floor(Math.random() * pairs.length);
  return pairs[pairIndex];
}

function main() {
  const chars = pickPair(CHARS);

  console.log((confusionPattern(BOARD_SIZE, chars)));
}

main();
