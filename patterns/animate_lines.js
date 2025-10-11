function delay() {
  for (let index = 0; index < 900000000; index++) {}
}

function generateFilledRow(columns, char, rows) {
  let row = rows;

  for (let column = 0; column < columns; column++) {
    console.clear();
    row += char;
    console.log(row);
    delay();
  }
  return row;
}

function animateLines(rows, columns, char) {
  let pattern = '';

  for (let row = 0; row < rows; row++) {
    pattern = generateFilledRow(columns, char, pattern);
    pattern += '\n';
    delay();
  }
}

animateLines(5, 10, '🧚🏻‍♀️');
