const BOARD_SIZE = 10;
const PAIRS = [
  ['M', 'W'], ['P', 'R'], ['B', 'D'], ['V', 'U'],
  ['D', 'O'], ['J', 'L'], ['C', 'G'], ['E', 'F'],
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
    return alphabets[(alphabets.indexOf(oddChar) + 1) % alphabets.length];
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

function main() {
  const pairIndex = randomNumber(PAIRS.length);
  const pair = PAIRS[pairIndex];
  const oddChar = pickOddChar(pair, ALPHABETS);
  const randomCell = generateRandomCell(BOARD_SIZE);
  const board = confusionBoard(BOARD_SIZE, pair);
  const randomRow = randomCell[0];
  const randomCol = randomCell[1];

  board[randomRow][randomCol] = oddChar;

  const pattern = boardToPattern(board);

  console.log(pattern);
}

main();
