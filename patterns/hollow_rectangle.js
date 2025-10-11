function generateFilledRow(columns, char) {
  return char.repeat(columns);
}

function generateHollowRow(columns, char) {
  if (columns <= 2) {
    return char.repeat(columns);
  }
  return char + ' '.repeat(columns - 2) + char;
}

function hollowRetangle(rows, columns, char) {
  const rectangle = [];

  rectangle.push(generateFilledRow(columns, char))
  
  for (let row = 1; row < rows - 1; row++) {
    rectangle.push(generateHollowRow(columns, char));
  }
  
  if (rows > 1) {
    rectangle.push(generateFilledRow(columns, char));
  }
  return rectangle.join('\n');
}

function generatePattern(rows, columns, char) {
  if (rows === 0 || columns === 0) {
    return '';
  }

  return hollowRetangle(rows, columns, char);
}

function getInput() {
  const dimensions = prompt('Enter dimensions[r, c] seperated by space: ').split(' ');
  const char = '+';

  return [dimensions, char];
}

function main() {
  const inputs = getInput();
  const rows = parseInt(inputs[0][0]);
  const columns = parseInt(inputs[0][1]);
  const char = inputs[1];

  console.log((generatePattern(rows, columns, char)));
  main();
}

main();
