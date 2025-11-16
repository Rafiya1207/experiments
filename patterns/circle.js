const equation = (radius, x, y) => {
  const sint = (y - radius) / radius;
  const cost = (x - radius) / radius;

  return Math.round(
    Math.sqrt(Math.pow(cost, 2) + Math.pow(sint, 2)) * radius,
  ) + radius;
};

const circleOf = (radius) => {
  const diameter = radius * 2;
  const circle = [];

  for (let x = 0; x < diameter + 1; x++) {
    for (let y = 0; y < diameter + 1; y++) {
      const char = equation(radius, x, y) === radius + radius ? "@ " : "  ";
      circle.push(char);
    }
    circle.push("\n");
  }
  return circle.join("");
};

console.log(circleOf(3));
