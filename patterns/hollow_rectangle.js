function generateFilledRow(columns, char) {
  return char.repeat(columns);
}

function generateHollowRow(columns, char,) {
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
    rectangle.push(generateFilledRow(columns, char))
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
  const char = prompt('enter character: ');

  return [dimensions, char];
}

function generateDimension(row, columns) {
  const rowOfDimension = [];

  for (let column = 0; column < columns; column++) {
    rowOfDimension.push([row, column]);
  }
  return rowOfDimension;
}

function testForDimensions() {
  const LIMIT = 5;

  for (let row = 0; row < LIMIT; row++) {
    const dimension = generateDimension(row, LIMIT);

    console.log(dimension);

    for (let curDimension = 0; curDimension < dimension.length; curDimension++) {
      const rows = dimension[curDimension][0];
      const columns = dimension[curDimension][1];

      console.log(generatePattern(rows, columns, '*'));
      console.log('-'.repeat(20));
    }
  }
}

function main() {
  const inputs = getInput();
  const rows = parseInt(inputs[0][0]);
  const columns = parseInt(inputs[0][1]);
  const char = inputs[1];

  console.log(generatePattern(rows, columns, char));
}

main();
