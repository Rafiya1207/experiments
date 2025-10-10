function generateVerticalRow(columns, chars) {
  let rowPattern = '';

  for (let column = 0; column < columns; column++) {
    rowPattern += chars[column % 2];
  }

  return rowPattern;
}

function generateHorizontalRow(row, columns, chars) {
  let rowPattern = '';

  for (let column = 0; column < columns; column++) {
    rowPattern += chars[row % 2];
  }

  return rowPattern;
}

function horizontalPattern(rows, columns, chars) {
  let pattern = [];

  for (let row = 0; row < rows; row++) {
    pattern.push(generateHorizontalRow(row, columns, chars));
  }

  return pattern.join('\n');
}

function verticalPattern(rows, columns, chars) {
  const pattern = [];

  for (let row = 0; row < rows; row++) {
    pattern.push(generateVerticalRow(columns, chars));
  }

  return pattern.join('\n');
}

function getInput() {
  const style = prompt('Enter style: \n| vertical(v) | horizontal(h) |');
  const dimensions = prompt('Enter dimensions[r, c] seperated by space: ').split(' ');
  const chars = prompt('Enter chars seperated by ","": ').split(',');

  return [style, dimensions, chars];
}

function getPattern(style, rows, columns, chars) {
  switch (style) {
    case 'v': return verticalPattern(rows, columns, chars);
    case 'h': return horizontalPattern(rows, columns, chars);
  }
}

function main() {
  const inputs = getInput();
  const style = inputs[0];
  const rows = inputs[1][0];
  const columns = inputs[1][1];
  const chars = inputs[2];

  console.log((getPattern(style, rows, columns, chars)));
}

main();
