const WORDS = ['code', 'word', 'test', 'case', 'data', 'file', 'loop', 'read', 'find', 'done'];
const ALPHABETS = 'abcdefghijklmnopqrstuvwxyz';

function randomNumber(end, start = 0) {
  return start + Math.floor(Math.random() * (end - start));
}

function logDashes() {
  console.log('-'.repeat(30));
}

function getAlphabetPosition(alphabet) {
  return ALPHABETS.indexOf(alphabet);
}

function encodeWord(word, code, alphabets) {
  let encodedWord = '';

  for (let index = 0; index < word.length; index++) {
    const charPosition = getAlphabetPosition(word[index]);
    const encodedPosition = (charPosition + code) % ALPHABETS.length;
    encodedWord += alphabets[encodedPosition];
  }
  return encodedWord;
}

function magenta(text) {
  return "\x1B[35m" + text + "\x1B[0m";
}

function displayInstructions(keyStartRange, keyEndRange) {
  logDashes();
  console.log(`Decode the Encoded`);
  logDashes();
  console.log(`->  key will be a number between ${keyStartRange} and ${keyEndRange}`);
  console.log(`->  chances will decrease if you make wrong guess`);
  console.log(`->  powers will decrease if you take a clue`);
  console.log(`\n->  NOTE: Shift the word backwards by the value of the key`);
  logDashes();
}

function askForGuess() {
  logDashes();
  return prompt('Guess the decoded word: ');
}

function isEven(number) {
  return number % 2 === 0;
}

function giveClue(key) {
  const clue = isEven(key) ? 'even' : 'odd';
  return `key is an ${clue} number`;
}

function details(powers, chances, encodedWord) {
  console.log(`\nTake help of this:\n${magenta(ALPHABETS)}`);
  logDashes();
  console.log(`${powers} power`);
  console.log(`${chances} chances`);
  console.log(`Decode: ${encodedWord}`);
}

function askForClue(powers, key) {
  let wantClue;
  if (powers > 0) {
    logDashes();
    wantClue = confirm('Do you want clue?');
  }

  if (wantClue) {
    console.log(giveClue(key));
    powers--;
    console.log(`${powers} powers left`);
  }

  return powers;
}

function guessedDifference(actualWord, guessedWord) {
  const guessedWordPosition = getAlphabetPosition(guessedWord[0]);
  const actualWordPosition = getAlphabetPosition(actualWord[0]);

  return Math.abs(actualWordPosition - guessedWordPosition);
}

function logDifference(actualWord, guessedWord, key) {
  const diff = guessedDifference(actualWord, guessedWord);
  let message = `🔴 Wrong Guess`;
  console.log(diff);

  if (diff + 1 === key || diff - 1 === key) {
    message = `🟡 Your guess is close to actual word`;
  }
  console.log(message);
  logDashes();
}

function game(actualWord, key, encodedWord, powers, chances) {
  details(powers, chances, encodedWord);

  const powersLeft = askForClue(powers, key);
  const guessedWord = askForGuess();

  if (actualWord === guessedWord) {
    console.log('🎉 you won\n');
    return;
  }

  chances--;
  if (chances === 0) {
    logDashes();
    console.log('OOPSY!, you ran out of chances');
    console.log(`The word is: ${actualWord}`);
    console.log(`The key is: ${key}`);
    return;
  }

  console.clear();
  // logDifference(actualWord, guessedWord, key);
  game(actualWord, key, encodedWord, powersLeft, chances);
}

function main() {
  const actualWord = WORDS[randomNumber(WORDS.length)];
  const keyStartRange = 1;
  const keyEndRange = 5;
  const key = randomNumber(keyStartRange, keyEndRange);
  const encodedWord = encodeWord(actualWord, key, ALPHABETS);
  let powers = 1;
  let chances = 5;

  displayInstructions(keyStartRange, keyEndRange);
  console.log(`->  ⚡️${powers} power`);
  console.log(`->  ${chances} chances\n`);

  const isStart = confirm('\nWant to Start the game');

  if (isStart) {
    console.clear();
    game(actualWord, key, encodedWord, powers, chances);
  }
}

main();
