const BOARD_SIZE = 15;
const CHARS = [['M', 'W'], [')', '(']];

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
