const equation = (r, x, y) => {
  const sint = (y - r) / r;
  const cost = (x - r) / r;

  return Math.round(
    Math.sqrt(Math.pow(cost, 2) + Math.pow(sint, 2)) * r,
  ) + r;
};

const circleOf = (radius) => {
  const diameter = radius * 2;
  const circle = [];

  for (let x = 0; x < diameter + 1; x++) {
    for (let y = 0; y < diameter + 1; y++) {
      const char = equation(r, x, y) === r + r ? "@ " : "  ";
      circle.push(char);
    }
    circle.push("\n");
  }
  return circle.join("");
};

console.log(circleOf(3));
