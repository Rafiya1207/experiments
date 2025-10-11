const LIMIT = 10;

const dimensions = [];

function generateRow(row, columns) {
  const rowOfDimensions = [];

  for (let column = 0; column < columns; column++) {
    rowOfDimensions.push([row, column]);
  }

  return rowOfDimensions;
}

for (let row = 0; row < LIMIT; row++) {
  dimensions.push(generateRow(row, LIMIT));
}

console.log(dimensions);
