function delay() {
  for (let index = 0; index < 900000000; index++) {}
}

function generateFilledRow(columns, char) {
  return char.repeat(columns);
}

function animateLines(rows, columns, char) {
  for (let row = 0; row < rows; row++) {
    console.log(generateFilledRow(columns, char));
    delay();
  }
}

animateLines(10, 5, '>.<   ');
