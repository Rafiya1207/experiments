function delay() {
  for (let index = 0; index < 1000000000; index++) {}
}

function filledRow(cols, char = ' ') {
  return char.repeat(cols);
}

function generateHollowRow(cols, char, thickness) {
  if (cols <= 2) {
    return filledRow(cols, char);
  }
  const border = filledRow(thickness, char);

  return border + filledRow(cols - (thickness * 2)) + border;
}

function hollowSquare(size, char, thickness) {
  const square = [];
  const rows = size;
  const cols = size;

  for (let row = 0; row < thickness; row++) {
    square.push(filledRow(cols, char))
  }

  for (let row = thickness; row < rows - thickness; row++) {
    square.push(generateHollowRow(cols, char, thickness));
  }

  if (rows > 1) {
    for (let row = 0; row < thickness; row++) {
      square.push(filledRow(cols, char))
    }
  }
  return square.join('\n');
}

function animateHollowSquare(size, char) {
  let square = '';

  for (let thickness = 1; thickness <= Math.floor(size / 2); thickness++) {
    square = hollowSquare(size, char, thickness);
    console.log(square);
    delay();
    console.clear();
  }
  return square;
}

function generatePattern(size, char) {
  if (size === 0) {
    return '';
  }

  return animateHollowSquare(size, char);
}

function getInput() {
  const size = prompt('Enter size of square: ');
  const char = prompt('Enter a character: ');

  return [size, char];
}

function main() {
  const inputs = getInput();
  const size = inputs[0];
  const char = inputs[1];

  console.log(generatePattern(size, char));
}

main();
