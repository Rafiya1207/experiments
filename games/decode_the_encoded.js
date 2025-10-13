const WORDS = ['code', 'word', 'test', 'case', 'data', 'file', 'loop', 'read', 'find', 'done'];
const ALPHABETS = 'abcdefghijklmnopqrstuvwxyz';

function randomNumber(end, start = 0) {
  return start + Math.floor(Math.random() * (end - start));
}

function logDashes() {
  console.log('-'.repeat(30));
}

function logEmptyLine() {
  console.log();
}

function getAlphabet(n, alphabets) {
  return alphabets[n];
}

function getAlphabetPosition(alphabet, alphabets) {
  return alphabets.indexOf(alphabet);
}

function encodeWord(word, code, alphabets) {
  let encodedWord = '';

  for (let index = 0; index < word.length; index++) {
    const charPosition = getAlphabetPosition(word[index], alphabets);
    const encodedPosition = (charPosition + code) % ALPHABETS.length;
    encodedWord += getAlphabet(encodedPosition, alphabets);
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
  logDashes();
}

function askForGuess() {
  return prompt('Guess the decoded word: ');
}

function askForClue() {
  return confirm('Do you want clue?');
}

function isEven(number) {
  return number % 2 === 0;
}

function giveClue(key) {
  const clue = isEven(key) ? 'even' : 'odd';
  return `key is an ${clue} number`;
}

function hasGuessed(actualWord, guessedWord) {
  return actualWord === guessedWord;
}

function game(actualWord, key, encodedWord, powers, chances) {


  console.log(`Take the help of this:\n${magenta(ALPHABETS)}`);
  logDashes();
  console.log(`${powers} power`);
  console.log(`${chances} chances`);
  console.log(`Decode: ${encodedWord}`);
  let wantClue; 
  if (powers > 0) {
    logDashes();
    wantClue = askForClue();
  }
  
  if (wantClue) {
    console.log(giveClue(key));
    powers--;
    console.log(`${powers} powers left`);
  }
  logDashes();
  const guessedWord = askForGuess();
  logEmptyLine();

  if (hasGuessed(actualWord, guessedWord)) {
    console.log('you won');
    return;
  }

  chances--;
  if (chances === 0) {
    logDashes();
    console.log(`Thee word is: ${actualWord}`);
    
    console.log('OOPSY!, you ran out of chances');
    return;
  }

  console.clear();
  console.log(`Wrong guess`);
  // console.log(`${chances} chances`);
  logDashes();
  
  game(actualWord, key, encodedWord, powers, chances);
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
  console.log(`->  ⚡️${powers} powers`);
  console.log(`->  ${chances} chances\n`);
  // console.log(`Take the help of this:\n${magenta(ALPHABETS)}`);


  const shouldStart = confirm('\n\nWant to Start the game');
  logEmptyLine();
  

  if (shouldStart) {
    game(actualWord, key, encodedWord, powers, chances);
  }

}

main();
