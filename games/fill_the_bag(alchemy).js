const INGREDIENTS = [
  ['fire', '🔥'],
  ['air', '💨'],
  ['water', '💧'],
  ['earth', '🌎'],
  ['lava', '🌋'],
  ['steam', '♨️'],
  ['stone', '🪨'],
  ['cloud', '☁️'],
];

function displayInstructions(ingredients) {
  for (let index = 0; index < ingredients.length; index++) {
    const ingredient = ingredients[index];
    console.log(`-->  ${ingredient[0]} - ${ingredient[1]}`);
  }
}

function askForIngredients() {
  const ingredient1 = prompt('1st ingredient: ');
  const ingredient2 = prompt('2nd ingredient: ');

  return [ingredient1, ingredient2];
}

function areValidIngredients(ingredient1, ingredient2, bag) {
  return bag.includes(ingredient1) && bag.includes(ingredient2);
}

function main() {
  const bag = ['🔥', '💨', '💧', '🌎'];
  const resultants = ['🌋', '♨️', '🪨', '☁️'];

  const combinations = [
    ['🔥', '🌎', '🌋'],
    ['🔥', '💧', '♨️'],
    // ['🌎', '💧', ''],
    // ['🌎', '💧', ''],
    ['💨', '🌋', '🪨'],
    ['💨', '♨️', '☁️'],
    // ['💨', '🪨', ''],
    // ['']
  ];

}
